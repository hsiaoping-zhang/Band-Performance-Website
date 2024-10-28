package middleware

import (
	"fmt"
	"band-app/enum"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
)

type LoginRequest struct {
	Email string `json:"email"`
	Level string `json:"level"`
	jwt.StandardClaims
}

// Secret 用於簽名 JWT token
var Secret = []byte(os.Getenv("SECRET_KEY"))

// JwtMiddleware 是用來驗證 JWT token 的中介層
func JWTMiddleware() fiber.Handler {
	println("Middleware: JWTMiddleware")

	return jwtware.New(jwtware.Config{
		SigningKey: []byte(os.Getenv("SECRET_KEY")),
	})
}

func Authentication(c *fiber.Ctx) error {
	// 取得 Authorization header 中的 token
	authHeader := c.Get("Authorization")
	// authHeader = authHeader.replace("Bearer ", "")
	authHeader = strings.Replace(authHeader, "Bearer ", "", 1)
	if len(authHeader) == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid JWT"})
	}

	// 驗證 JWT token
	token, err := jwt.Parse(authHeader, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		// type: []byte!!
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired JWT"})
	}

	// JWT 驗證通過，執行後續邏輯
	return c.Next()
}

func AuthorizationAdmin(c *fiber.Ctx) error {
	// 取得 Authorization header 中的 token
	fmt.Print("AuthorizationAdminMiddleware\n")
	authHeader := c.Get("Authorization")
	authHeader = strings.Replace(authHeader, "Bearer ", "", 1)
	if len(authHeader) == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid JWT"})
	}

	tokenClaims, err := jwt.ParseWithClaims(authHeader, &LoginRequest{}, func(claims *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*LoginRequest); ok && tokenClaims.Valid {
			if claims.Level != string(enum.Admin) {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
			}
		}
	}

	if err != nil || !tokenClaims.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired JWT"})
	}

	// JWT 驗證通過，執行後續邏輯
	return c.Next()
}
