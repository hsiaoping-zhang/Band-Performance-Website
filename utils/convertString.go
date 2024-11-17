package utils

import (
	"strings"
)

func ConvertPerformersStringToList(performers string) []string {
	array := strings.Split(performers, ",")
	return array
}
