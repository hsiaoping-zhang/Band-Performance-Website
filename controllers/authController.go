package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"band-app/initializers"
	"band-app/models"
	"band-app/utils"

	"github.com/gofiber/fiber/v2"
	// "github.com/robbyklein/gr/models"
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

func parseUserInfo(response *http.Response) (userInfo, error) {
	// 讀取回應 Body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %v", err)
		return userInfo{}, err
	}

	info := userInfo{}

	if err := json.Unmarshal(body, &info); err != nil {
		log.Fatalf("Failed to parse JSON response: %v", err)
		return userInfo{}, err
	}

	fmt.Print("success\n")
	fmt.Print("userInfo:", info)

	return info, nil
}

func HandleGoogleLoginResponse(c *fiber.Ctx) error {
	fmt.Print("HandleGoogleLoginResponse\n")

	var bodyData struct {
		AccessToken string `json:"access_token"`
	}

	if err := c.BodyParser(&bodyData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "參數錯誤",
		})
	}

	response, err := http.Get(GOOGLE_INFO_URL + bodyData.AccessToken)
	fmt.Print(response)
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
	user, err := models.GetUserByPermissionId(initializers.DB, obtainedUserInfo.User.PermissionId)
	if err != nil {
		fmt.Print(err, "\n")
		// there is no user, register user
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

	// record to databse
	if err = models.RecordLoginTime(initializers.DB, user.PermissionId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	fmt.Print("RecordLoginTime finish\n")

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

// func Login(c *fiber.Ctx) error {
// 	fmt.Print("Login\n")

// 	// Parse body
// 	var loginRequest struct {
// 		Email        string `json:"email"`
// 		PermissionId string `json:"permission_id"`
// 	}

// 	if err := c.BodyParser(&loginRequest); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"error": "參數錯誤",
// 		})
// 	}

// // Find the user by credentials
// user, err := models.GetUserByEmail(initializers.DB, loginRequest.Email)
// if err != nil {
// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 		"error": err.Error(),
// 	})
// }

// if !user.IsValid {
// 	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
// 		"error": "帳號申請尚未通過，請耐心等候",
// 	})
// }

// day := time.Hour * 24
// claims := jtoken.MapClaims{
// 	"email": user.Email,
// 	"level": user.Level,
// 	"exp":   time.Now().Add(day * 1).Unix(),
// }
// fmt.Print("Create token\n")
// // Create token
// token := jtoken.NewWithClaims(jtoken.SigningMethodHS256, claims)
// // Generate encoded token and send it as response.
// t, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
// if err != nil {
// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 		"error": err.Error(),
// 	})
// }
// Return the token
// 	return c.Status(fiber.StatusOK).JSON(fiber.Map{
// 		"token": t,
// 	})
// }
