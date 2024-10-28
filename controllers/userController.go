package controllers

import (
	"fmt"
	"time"

	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
	// jtoken "github.com/golang-jwt/jwt/v4"
	// "github.com/robbyklein/gr/models"
)

func GetUserByPermissionId(c *fiber.Ctx) error {
	// Get all activity
	fmt.Printf("controller API: GetUserByPermissionId\n")

	permissionId := c.Params("permission_id")

	userResult, err := models.GetUserByPermissionId(initializers.DB, permissionId)
	if err != nil {
		fmt.Print("error:", err)
		return c.JSON(fiber.Map{
			"status": 500,
		})
	}

	return c.JSON(fiber.Map{
		"status": 200,
		"user":   userResult,
	})
}

func CreateApplyUser(c *fiber.Ctx) error {
	fmt.Print("API: CreateUser\n")

	// Parse body
	var createdUser struct {
		// id       int
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

	fmt.Print((createdUser))

	// check if exist
	// if searchUserResult, err := models.GetUserByPermissionId(initializers.DB, createdUser.PermissionId); err != nil {
	// 	fmt.Print("User exist\n")
	// 	if searchUserResult.IsValid {
	// 		fmt.Print("User has apply\n")
	// 	} else {
	// 		fmt.Print("User apply not valid\n")
	// 	}
	// 	return err
	// }

	newUser := models.User{
		Name:          createdUser.Name,
		Email:         createdUser.Email,
		PermissionId:  createdUser.PermissionId,
		Level:         "user",
		IsValid:       false,
		CreatedTime:   createdUser.LastLoginTime,
		LastLoginTime: createdUser.LastLoginTime,
	}
	// Time:     parseTime}

	// DB implement: INSERT

	// result := initializers.DB.CreateActivity(&newActivity)
	if returnId, err := models.CreateApplyUser(initializers.DB, newUser); err != nil {
		return c.JSON(fiber.Map{
			"status": 500,
			"error":  err,
		})
	} else {
		return c.JSON(fiber.Map{
			"status": 200,
			"id":     returnId,
		})
	}
	// mock: Create record
}

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

func ApproveUser(c *fiber.Ctx) error {
	fmt.Print("API: ApproveUser\n")

	// Parse body
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
