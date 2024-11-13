package controllers

import (
	"fmt"
	"net/url"

	// "band-app/enum"

	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
	// "github.com/robbyklein/gr/models"
)

func GetPerformerActivity(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetPerformerActivity\n")

	performerName := c.Params("performerName")

	decodeName, _ := url.QueryUnescape(performerName)
	// fmt.Println("performerName:", decodeName, "\n")

	// search in DB
	activities, err := models.GetPerformerActivity(initializers.DB, decodeName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity": activities,
	})

}
