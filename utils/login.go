package utils

import (
	"fmt"
	"os"
	"time"

	jtoken "github.com/golang-jwt/jwt/v4"
)

func GenerateLoginToken(permissionId string, email string, level string) (string, error) {
	day := time.Hour * 24
	claims := jtoken.MapClaims{
		"email": email,
		"level": level,
		"exp":   time.Now().Add(day * 1).Unix(),
	}
	fmt.Print("Create token\n")
	// Create token
	token := jtoken.NewWithClaims(jtoken.SigningMethodHS256, claims)
	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}
	return t, nil
}
