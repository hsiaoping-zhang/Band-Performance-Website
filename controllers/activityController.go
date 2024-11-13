package controllers

import (
	"fmt"
	"time"

	"band-app/enum"
	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
	// "github.com/robbyklein/gr/models"
)

func GetDefaultActivity(c *fiber.Ctx) error {
	// Get all activity
	fmt.Printf("controller API: GetDefaultActivity\n")

	activityArray, err := models.GetDefaultActivity(initializers.DB)
	if err != nil {
		fmt.Print("error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity_array": activityArray,
	})
}

func GetActivity(c *fiber.Ctx) error {
	// Get all activity
	fmt.Printf("controller API: GetActivity\n")

	// check permission
	activityArray, err := models.GetActivityList(initializers.DB)
	if err != nil {
		fmt.Print("error:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity_array": activityArray,
	})
}

func GetWeekActivity(c *fiber.Ctx) error {
	// Get all activity
	fmt.Printf("controller API: GetWeekActivity\n")

	weekNum := c.Params("week")

	activityArray, err := models.GetWeekActivity(initializers.DB, weekNum)
	if err != nil {
		fmt.Print("error:", err)
		return c.JSON(fiber.Map{
			"status": 400,
			"error":  "search error",
		})
	}

	return c.JSON(fiber.Map{
		"status":   200,
		"activity": activityArray,
	})
}

func GetCityList(c *fiber.Ctx) error {
	cityList := []string{
		"臺北市",
		"基隆市",
		"新北市",
		"連江縣",
		"宜蘭縣",
		"新竹市",
		"新竹縣",
		"桃園市",
		"苗栗縣",
		"臺中市",
		"彰化縣",
		"南投縣",
		"嘉義市",
		"嘉義縣",
		"雲林縣",
		"臺南市",
		"高雄市",
		"澎湖縣",
		"金門縣",
		"屏東縣",
		"臺東縣",
		"花蓮縣"}
	return c.JSON(fiber.Map{
		"data":   cityList,
		"status": 200,
	})
}

func GetActivityById(c *fiber.Ctx) error {
	fmt.Printf("API: GetActivityById\n")
	activityId := c.Params("id")

	var activity models.Activity

	// DB implement: SELECT
	activity, err := models.GetActivityById(initializers.DB, activityId)
	if err != nil {
		fmt.Print("error:", err)
		return err
	}

	// mock

	return c.JSON(fiber.Map{
		"activity": activity,
	})

}

func CreateActivity(c *fiber.Ctx) error {
	fmt.Print("API: CreateActivity\n")

	// Parse body
	var createdActivity struct {
		// id       int
		Name       string    `json:"name"`
		Date       string    `json:"date"`
		Time       time.Time `json:"time"`
		Area       string    `json:"area"`
		City       string    `json:"city"`
		Location   string    `json:"location"`
		Performers string    `json:"performers"`
		IsFree     bool      `json:"is_free"`
		Note       string    `json:"note"`
	}

	if err := c.BodyParser(&createdActivity); err != nil {
		fmt.Print(createdActivity.Name)
		return err
	}

	// TODO: check permission
	// user, err := models.GetUserByPermissionId(initializers.DB, createdActivity.UserPermissionId)
	// if err != nil {
	// 	return c.JSON(fiber.Map{
	// 		"status": 500,
	// 		"err":    err,
	// 	})
	// } else if user.Level != enum.Admin {
	// 	c.JSON(fiber.Map{
	// 		"status": 500, // permission error
	// 		"error":  "permission invalid",
	// 	})
	// }

	// time.Date(2023, time.September, 5, 15, 30, 0, 0, time.Local)

	newActivity := models.Activity{
		Name:       createdActivity.Name,
		Area:       createdActivity.Area,
		Location:   createdActivity.Location,
		Time:       createdActivity.Time,
		City:       createdActivity.City,
		Note:       createdActivity.Note,
		IsFree:     createdActivity.IsFree,
		Performers: createdActivity.Performers}
	// Time:     parseTime}

	// DB implement: INSERT
	// result := initializers.DB.CreateActivity(&newActivity)
	returnId, err := models.CreateActivity(initializers.DB, newActivity)
	if err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	}

	if err = models.CreatePerformersIfNotExisted(initializers.DB, createdActivity.Performers); err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	}

	if err = models.CreatePerformerActivity(initializers.DB, createdActivity.Performers, int(returnId)); err != nil {
		return c.JSON(fiber.Map{
			"status": enum.DBError,
			"error":  err,
		})
	}

	return c.JSON(fiber.Map{
		"status": enum.Success,
		"id":     returnId,
	})

	// mock: Create record
}

func UpdateActivity(c *fiber.Ctx) error {
	// Parse body
	var parsedActivity struct {
		Name       string    `json:"name"`
		Date       string    `json:"date"`
		Time       time.Time `json:"time"`
		Area       string    `json:"area"`
		City       string    `json:"city"`
		Location   string    `json:"location"`
		Performers string    `json:"performers"`
		IsFree     bool      `json:"is_free"`
		Note       string    `json:"note"`
	}

	activityId := c.Params("id")

	if err := c.BodyParser(&parsedActivity); err != nil {
		fmt.Print(parsedActivity.Name)
		return err
	}

	updatedActivity := models.Activity{
		Name:       parsedActivity.Name,
		Area:       parsedActivity.Area,
		Location:   parsedActivity.Location,
		Time:       parsedActivity.Time,
		City:       parsedActivity.City,
		Note:       parsedActivity.Note,
		IsFree:     parsedActivity.IsFree,
		Performers: parsedActivity.Performers}
	// Date:     date,
	// Time:     parseTime}

	fmt.Print(parsedActivity.Name, "\n")

	err := models.UpdateActivity(initializers.DB, activityId, updatedActivity)
	if err != nil {
		c.JSON(fiber.Map{
			"success": false,
			"error":   err,
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
	})
}

func DeleteActivity(c *fiber.Ctx) error {
	activityId := c.Params("id")
	fmt.Print("API: delete ID:", activityId)

	if _, err := models.DeleteActivityInPerformerActivity(initializers.DB, activityId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	rowsAffected, err := models.DeleteActivity(initializers.DB, activityId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"affected": rowsAffected,
	})
}
