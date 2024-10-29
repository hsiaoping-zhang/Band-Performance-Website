package main

import (
	"os"

	"band-app/controllers"
	"band-app/initializers"
	"band-app/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html"
)

func init() {
	initializers.LoadEnvVars()
	initializers.ConnectToDB()
}

func main() {
	// Load templates
	engine := html.New("./views", ".tmpl")

	// Create app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure app
	app.Static("/", "./public")

	// jwt := middleware.JWTMiddleware()

	// Routing
	// app.Get("/api/tasks", controllers.FetchTask)
	app.Get("/api/activity", controllers.GetDefaultActivity)
	app.Get("/api/activityList", controllers.GetActivity)
	app.Get("/api/activity/:id", middleware.AuthorizationAdmin, controllers.GetActivityById)
	app.Get("/api/CityList", controllers.GetCityList)
	app.Post("/api/activity", controllers.CreateActivity)
	app.Patch("/api/activity/:id", middleware.AuthorizationAdmin, controllers.UpdateActivity)
	app.Delete("/api/activity/:id", middleware.AuthorizationAdmin, controllers.DeleteActivity)
	app.Get("/api/weekActivity/:week", controllers.GetWeekActivity)

	app.Get("/api/user/:permission_id", controllers.GetUserByPermissionId)
	app.Post("/api/user/apply", controllers.CreateApplyUser)
	app.Get("/api/user/auth/unapproved", middleware.AuthorizationAdmin, controllers.GetUnApprovedUsers)
	app.Patch("/api/user/auth/approve", middleware.AuthorizationAdmin, controllers.ApproveUser)

	// app.Post("/api/user/auth/login", controllers.Login)
	app.Post("/api/user/auth/googleLogin", controllers.HandleGoogleLoginResponse)

	app.Post("/api/performer/:id", controllers.GetPerformerById) //middleware.AuthorizationAdmin,
	app.Get("/api/performerList", middleware.AuthorizationAdmin, controllers.GetPerformerList)
	app.Post("/api/performer", controllers.CreatePerformer)
	app.Patch("api/performer/:id", middleware.AuthorizationAdmin, controllers.UpdatePerformer)
	app.Delete("api/performer/:id", controllers.DeletePerformer)

	app.Get("/api/performerActivity/:performerName", controllers.GetPerformerActivity)

	frontendRoutes := []string{
		"/",
		"/about",
		"/newActivity",
		"/updateActivity/:activity_id",
		"/apply",
		"/applySuccess",
		"/login",
		"performerList",
		"/activityList",
		"/approveUser",
		"/performerActivity",
	}

	for _, route := range frontendRoutes {
		app.Get(route, controllers.Home)
	}

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
