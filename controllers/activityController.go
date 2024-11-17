package controllers

import (
	"fmt"
	"time"

	"band-app/enum"
	"band-app/initializers"
	"band-app/models"

	"github.com/gofiber/fiber/v2"
)

// Get all activities in a week
func GetDefaultActivity(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetDefaultActivity\n")

	activityArray, err := models.GetDefaultActivity(initializers.DB)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity_array": activityArray,
	})
}

// Get all activities for administrator
func GetActivity(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetActivity\n")

	activityArray, err := models.GetAllActivityList(initializers.DB)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity_array": activityArray,
	})
}

// Get weekly activities accroding to the week selection
func GetWeekActivity(c *fiber.Ctx) error {
	fmt.Printf("controller API: GetWeekActivity\n")

	weekNum := c.Params("week")
	activityArray, err := models.GetWeekActivity(initializers.DB, weekNum)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity_array": activityArray,
	})
}

// for administrator
func GetActivityById(c *fiber.Ctx) error {
	fmt.Printf("API: GetActivityById\n")
	activityId := c.Params("id")

	var activity models.Activity
	activity, err := models.GetActivityById(initializers.DB, activityId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"err": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"activity": activity,
	})
}

// for administrator
func CreateActivity(c *fiber.Ctx) error {
	fmt.Print("API: CreateActivity\n")

	// parse body
	var createdActivity struct {
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
		return err
	}

	newActivity := models.Activity{
		Name:       createdActivity.Name,
		Area:       createdActivity.Area,
		Location:   createdActivity.Location,
		Time:       createdActivity.Time,
		City:       createdActivity.City,
		Note:       createdActivity.Note,
		IsFree:     createdActivity.IsFree,
		Performers: createdActivity.Performers}

	// create activity to `activity`` table
	returnId, err := models.CreateActivity(initializers.DB, newActivity)
	if err != nil {
		return c.Status(int(enum.DBError)).JSON(fiber.Map{
			"error": err,
		})
	}

	// create new performer to `performer` table if not exist
	if err = models.CreatePerformersIfNotExisted(initializers.DB, createdActivity.Performers); err != nil {
		return c.Status(int(enum.DBError)).JSON(fiber.Map{
			"error": err,
		})
	}

	// create performer to activty map to `PerformerActivity` table
	if err = models.CreatePerformerActivity(initializers.DB, createdActivity.Performers, int(returnId)); err != nil {
		return c.Status(int(enum.DBError)).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.Status(int(enum.Success)).JSON(fiber.Map{
		"id": returnId,
	})
}

// for administrator
func UpdateActivity(c *fiber.Ctx) error {
	// parse body
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
		c.Status(int(enum.QueryError)).JSON(fiber.Map{
			"err": err,
		})
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

	err := models.UpdateActivity(initializers.DB, activityId, updatedActivity)
	if err != nil {
		c.Status(int(enum.DBError)).JSON(fiber.Map{
			"err": err,
		})
	}
	return c.Status(int(enum.Success)).JSON(fiber.Map{})
}

// for administrator
func DeleteActivity(c *fiber.Ctx) error {
	activityId := c.Params("id")
	fmt.Print("API: DeleteActivity ID:", activityId)

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

// get all city in Taiwan
func GetCityList(c *fiber.Ctx) error {
	cityList := []string{
		"臺北市", "基隆市", "新北市", "宜蘭縣",
		"新竹市", "新竹縣", "桃園市", "苗栗縣",
		"臺中市", "彰化縣", "南投縣", "雲林縣",
		"嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣",
		"澎湖縣", "金門縣", "連江縣",
		"臺東縣", "花蓮縣"}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": cityList,
	})
}
