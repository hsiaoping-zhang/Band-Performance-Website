package controllers

import (
	"fmt"
	"time"

	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
)

// for google login and check user status
func GetUserByPermissionId(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetUserByPermissionId\n")

	permissionId := c.Params("permission_id")

	userResult, err := models.GetUserByPermissionId(initializers.DB, permissionId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": userResult,
	})
}

// NOT USED: for membership
func CreateApplyUser(c *fiber.Ctx) error {
	fmt.Print("API: CreateUser\n")

	// parse body
	var createdUser struct {
		Name          string    `json:"name"`
		Email         string    `json:"email"`
		PermissionId  string    `json:"permission_id"`
		LastLoginTime time.Time `json:"last_login_time"`
		Level         string    `json:"level"`
	}

	if err := c.BodyParser(&createdUser); err != nil {
		fmt.Print(createdUser.Name)
		return err
	}

	// check if exist
	searchUserResult, err := models.GetUserByPermissionId(initializers.DB, createdUser.PermissionId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}
	// TODO: User nil
	if searchUserResult.IsValid {
		return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
			"err": "使用者已申請",
		})
	}

	newUser := models.User{
		Name:          createdUser.Name,
		Email:         createdUser.Email,
		PermissionId:  createdUser.PermissionId,
		Level:         "user",
		IsValid:       false,
		CreatedTime:   createdUser.LastLoginTime,
		LastLoginTime: createdUser.LastLoginTime,
	}

	if returnId, err := models.CreateApplyUser(initializers.DB, newUser); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	} else {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id": returnId,
		})
	}
}

// for adminstrator
func GetUnApprovedUsers(c *fiber.Ctx) error {
	fmt.Print("API: GetUnApprovedUsers\n")

	users, err := models.GetUnApprovedUsers(initializers.DB)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"users": users,
	})
}

// for adminstrator
func ApproveUser(c *fiber.Ctx) error {
	fmt.Print("API: ApproveUser\n")

	// parse body
	var userInfo struct {
		Email string `json:"email"`
	}

	if err := c.BodyParser(&userInfo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"err": err,
		})
	}

	if err := models.ApproveUser(initializers.DB, userInfo.Email); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}
