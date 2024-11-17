package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"band-app/initializers"
	"band-app/models"
	"band-app/utils"

	"github.com/gofiber/fiber/v2"
)

var GOOGLE_INFO_URL = "https://www.googleapis.com/drive/v3/about?fields=user&access_token="

type user struct {
	Kind         string `json:"kind"`
	DisplayName  string `json:"displayName"`
	Photolink    string `json:"photoLink"`
	Me           bool   `json:"me"`
	PermissionId string `json:"permissionId"`
	EmailAddress string `josn:"emailAddress"`
}

// 解析 JSON 回應
type userInfo struct {
	User user `json:"user"`
}

// TODO: user role with admin or normal user
func HandleGoogleLoginResponse(c *fiber.Ctx) error {
	fmt.Print("HandleGoogleLoginResponse\n")

	var bodyData struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.BodyParser(&bodyData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	response, err := http.Get(GOOGLE_INFO_URL + bodyData.AccessToken)
	if response.StatusCode != fiber.StatusOK {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err,
		})
	}

	// parse response
	obtainedUserInfo, err := parseUserInfo(response)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	// check user status
	user, err := models.GetUserByEmail(initializers.DB, obtainedUserInfo.User.EmailAddress)

	// not found, register a new user
	if err != nil {
		newUser := models.User{
			Name:          obtainedUserInfo.User.DisplayName,
			Email:         obtainedUserInfo.User.EmailAddress,
			PermissionId:  obtainedUserInfo.User.PermissionId,
			Level:         "user",
			IsValid:       false,
			CreatedTime:   time.Now(),
			LastLoginTime: time.Now(),
		}
		userId, errmsg := models.CreateApplyUser(initializers.DB, newUser)

		if errmsg != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"err": errmsg,
			})
		}

		return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
			"userId": userId,
			"info":   "請等待管理員開通權限",
		})
	}

	// invalid user
	if !user.IsValid {
		return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
			"info": "目前權限尚未開通，請等待管理員",
		})
	}

	// login, record to databse
	if err = models.RecordLoginTime(initializers.DB, user.PermissionId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	// generate token
	token, err := utils.GenerateLoginToken(user.PermissionId, user.Email, string(user.Level))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"level": user.Level,
		"token": token,
	})

}

func parseUserInfo(response *http.Response) (userInfo, error) {
	// 讀取回應 body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		// fmt.Print("Failed to read response body: ", err)
		return userInfo{}, err
	}

	info := userInfo{}
	if err := json.Unmarshal(body, &info); err != nil {
		fmt.Print("Failed to parse JSON response: ", err)
		return userInfo{}, err
	}

	// fmt.Print("userInfo:", info, "\n")

	return info, nil
}
