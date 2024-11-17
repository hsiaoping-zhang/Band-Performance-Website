package controllers

import (
	"fmt"

	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
)

// for administrator
func GetPerformerList(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetPerformerList\n")

	performers, err := models.GetAllPerformers(initializers.DB)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"performers": performers,
	})
}

// TODO
func CreatePerformer(c *fiber.Ctx) error {
	fmt.Print("API: CreatePerformer\n")

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"id": -1,
	})
}

// for administrator
func UpdatePerformer(c *fiber.Ctx) error {
	fmt.Print("API: UpdatePerformer\n")

	// parse body
	var parsedPerformer struct {
		Id          string `json:"id"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.BodyParser(&parsedPerformer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	updatedPerformer := models.Performer{
		Name:        parsedPerformer.Name,
		Description: parsedPerformer.Description}

	if err := models.UpdatePerformer(initializers.DB, parsedPerformer.Id, updatedPerformer); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{})
}

// for administrator
func DeletePerformer(c *fiber.Ctx) error {
	performerId := c.Params("id")
	fmt.Print("API: DeletePerformer:", performerId, "\n")

	rowsAffected, err := models.DeletePerformer(initializers.DB, performerId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"affected": rowsAffected,
	})
}
