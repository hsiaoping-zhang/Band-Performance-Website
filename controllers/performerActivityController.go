package controllers

import (
	"fmt"
	"net/url"

	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
)

func GetPerformerActivity(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetPerformerActivity\n")

	performerName := c.Params("performerName")

	// decode url to text
	decodeName, _ := url.QueryUnescape(performerName)

	// search in DB
	activities, err := models.GetPerformerActivityByPerformerName(initializers.DB, decodeName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity": activities,
	})
}
