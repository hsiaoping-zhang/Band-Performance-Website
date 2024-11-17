package models

import (
	"band-app/utils"
	"database/sql"
	"fmt"
	"strings"
)

type Performer struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func GetPerformerById(db *sql.DB, performerId string) (Performer, error) {
	fmt.Print("model: GetUserByPermissionId\n")

	var targetPerformer Performer
	query := "SELECT id, name FROM Performer WHERE id = ?"
	row := db.QueryRow(query, targetPerformer)

	if err := row.Scan(&targetPerformer.Id, &targetPerformer.Name); err != nil {
		return targetPerformer, err
	}

	return targetPerformer, nil
}

func GetAllPerformers(db *sql.DB) ([]Performer, error) {
	fmt.Print("model: GetPerformers\n")

	var targetPerformers []Performer
	query := "SELECT id, name, description FROM Performer LIMIT 20"

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var performer Performer
		if err := rows.Scan(&performer.Id, &performer.Name, &performer.Description); err != nil {
			fmt.Print(err)
			return nil, err
		}
		targetPerformers = append(targetPerformers, performer)
	}

	if err := rows.Err(); err != nil {
		fmt.Print(err)
		return nil, err
	}

	return targetPerformers, nil
}

// NOT USED
func CreatePerformer(db *sql.DB, performer Performer) (int64, error) {
	fmt.Print("model: CreatePerformer\n")

	query := "INSERT INTO Performer (name, description) VALUES (?, ?)"
	result, err := db.Exec(query, performer.Name, performer.Description)
	if err != nil {
		return -1, err
	}

	if returnId, err := result.LastInsertId(); err != nil {
		return -1, err
	} else {
		return returnId, err
	}
}

func CreatePerformersIfNotExisted(db *sql.DB, performers string) error {
	fmt.Print("model: CreatePerformersIfNotExisted\n")

	performersArray := utils.ConvertPerformersStringToList(performers)
	placeholders := make([]string, len(performersArray))
	names := make([]interface{}, len(performersArray))

	for i, performer := range performersArray {
		placeholders[i] = "(?)" // 每個值對應一個佔位符
		names[i] = performer    // 將樂團名稱添加到 values 切片中
	}

	query := fmt.Sprintf("INSERT IGNORE INTO Performer (name) VALUES %s", strings.Join(placeholders, ", "))

	if _, err := db.Exec(query, names...); err != nil {
		return err
	}

	return nil
}

func UpdatePerformer(db *sql.DB, performerId string, performer Performer) error {
	query := "UPDATE Performer SET name = ?, description = ? WHERE id = ?"
	if _, err := db.Exec(query, performer.Name, performer.Description, performerId); err != nil {
		return err
	}
	return nil
}

func DeletePerformer(db *sql.DB, performerId string) (int64, error) {
	query := "DELETE FROM Performer WHERE id = ?"
	result, err := db.Exec(query, performerId)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}
