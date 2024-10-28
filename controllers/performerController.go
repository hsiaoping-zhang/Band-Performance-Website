package controllers

import (
	"fmt"

	"band-app/enum"
	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
)

func GetPerformerById(c *fiber.Ctx) error {
	// Get perofrmer
	fmt.Printf("controller API: GetPerformer\n")

	perofrmerId := c.Params("id")

	var query struct {
		PermissionId string `json:"permission_id"`
		PerformerId  int    `json:"performer_id"`
	}

	if err := c.BodyParser(&query); err != nil {
		return c.JSON(fiber.Map{
			"status": enum.QueryError,
			"error":  "parse query error",
		})
	}

	// check permission
	if user, err := models.GetUserByPermissionId(initializers.DB, query.PermissionId); err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	} else if user.Level == enum.Guest {
		return c.JSON(fiber.Map{
			"status": enum.PermissionInvalid,
			"error":  "Only user have access to query.",
		})
	}

	performer, err := models.GetPerformerById(initializers.DB, perofrmerId)
	if err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	}

	return c.JSON(fiber.Map{
		"status":    enum.Success,
		"performer": performer,
	})
}

func GetPerformerList(c *fiber.Ctx) error {
	// Get perofrmers
	fmt.Printf("controller API: GetPerformerList\n")

	// var query struct {
	// 	PermissionId string `json:"permissionId"`
	// }

	// if err := c.BodyParser(&query); err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.QueryError,
	// 		"error":  "parse query error",
	// 	})
	// }

	// fmt.Print(query)

	// check permission
	// if user, err := models.GetUserByPermissionId(initializers.DB, query.PermissionId); err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.DBError,
	// 		"error":  err,
	// 	})
	// } else if user.Level == enum.Guest {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.PermissionInvalid,
	// 		"error":  "Only user have access to query.",
	// 	})
	// }

	performers, err := models.GetPerformers(initializers.DB)

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
	fmt.Print("API: CreateActivity\n")

	// // Parse body
	// var createdActivity struct {
	// 	// id       int
	// 	Name         string    `json:"name"`
	// 	Date         string    `json:"date"`
	// 	Time         time.Time `json:"time"`
	// 	Area         string    `json:"area"`
	// 	City         string    `json:"city"`
	// 	Location     string    `json:"location"`
	// 	Performers   string    `json:"performers"`
	// 	IsFree       bool      `json:"is_free"`
	// 	Note         string    `json:"note"`
	// 	PermissionId string    `json:"permission_id"`
	// }

	// if err := c.BodyParser(&createdActivity); err != nil {
	// 	fmt.Print(createdActivity.Name)
	// 	return err
	// }

	// check permission
	// if user, err := models.GetUserByPermissionId(initializers.DB, createdActivity.PermissionId); err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.DBError,
	// 		"error":  err,
	// 	})
	// } else if user.Level != enum.Admin {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.PermissionInvalid,
	// 		"error":  "Only Admin can create performer.",
	// 	})
	// }

	// newActivity := models.Activity{
	// 	Name:       createdActivity.Name,
	// 	Area:       createdActivity.Area,
	// 	Location:   createdActivity.Location,
	// 	Time:       createdActivity.Time,
	// 	City:       createdActivity.City,
	// 	Note:       createdActivity.Note,
	// 	IsFree:     createdActivity.IsFree,
	// 	Performers: createdActivity.Performers}

	// // DB implement
	// returnId, err := models.CreateActivity(initializers.DB, newActivity)

	// if err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.DBError,
	// 		"error":  err,
	// 	})
	// }

	// return ID from DB(?)
	return c.JSON(fiber.Map{
		"status": enum.Success,
		"id":     -1,
	})
}

func UpdatePerformer(c *fiber.Ctx) error {
	fmt.Print("API: UpdatePerformer\n")
	// Parse body
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

	// // check permission
	// if user, err := models.GetUserByPermissionId(initializers.DB, parsedPerformer.PermissionId); err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.DBError,
	// 		"error":  err,
	// 	})
	// } else if user.Level != enum.Admin {
	// 	return c.JSON(fiber.Map{
	// 		"status": enum.PermissionInvalid,
	// 		"error":  "Only admin can update information of performer.",
	// 	})
	// }

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

func DeletePerformer(c *fiber.Ctx) error {
	performerId := c.Params("id")
	fmt.Print("API: DeletePerformer:", performerId, "\n")

	// authorization
	// -- check permission

	rowsAffected, err := models.DeletePerformer(initializers.DB, performerId)
	if err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	}

	return c.JSON(fiber.Map{
		"status":   enum.Success,
		"affected": rowsAffected,
	})
}
