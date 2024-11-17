package models

import (
	"band-app/utils"
	"database/sql"
	"fmt"
	"strings"
	"time"
)

func CreatePerformerActivity(db *sql.DB, performers string, activityId int) error {
	performersArray := utils.ConvertPerformersStringToList(performers)
	placeholders := make([]string, len(performersArray))
	args := make([]interface{}, len(performersArray)+1)
	args[0] = activityId

	for i, performer := range performersArray {
		placeholders[i] = "(?)" // 每個值對應一個佔位符
		args[i+1] = performer   // 將樂團名稱添加到 values 切片中
	}

	query := fmt.Sprintf("INSERT INTO PerformerActivity (performer_id, activity_id) "+
		"SELECT id, ? FROM Performer where name IN (%s)", strings.Join(placeholders, ", "))

	if _, err := db.Exec(query, args...); err != nil {
		return err
	}

	return nil
}

func DeleteActivityInPerformerActivity(db *sql.DB, activityId string) (int64, error) {
	queryPerformerActivity := "DELETE FROM PerformerActivity WHERE activity_id = ?"
	result, err := db.Exec(queryPerformerActivity, activityId)
	if err != nil {
		return 0, err
	} else {
		rowsAffected, _ := result.RowsAffected()
		return rowsAffected, nil
	}

}

func GetPerformerActivityByPerformerName(db *sql.DB, performerName string) ([]Activity, error) {
	if performerName == "" {
		return nil, nil
	}

	query := `SELECT activity.id, activity.name, activity.time, activity.area, activity.loc, activity.is_free, activity.note, activity.city, activity.performers
		FROM PerformerActivity 
		JOIN activity ON activity.id = PerformerActivity.activity_id
		WHERE performer_id = (SELECT id FROM Performer WHERE name LIKE ?) AND YEARWEEK(activity.time, 1) >= YEARWEEK(CURDATE(), 1) ORDER BY time ASC`
	performerNameString := "%" + performerName + "%"
	rows, err := db.Query(query, performerNameString)

	if err != nil {
		return nil, err
	}

	var activities []Activity
	loc := time.FixedZone("CST", 8*60*60)
	for rows.Next() {
		var activity Activity
		if err := rows.Scan(&activity.Id, &activity.Name, &activity.Time, &activity.Area, &activity.Location, &activity.IsFree, &activity.Note, &activity.City, &activity.Performers); err != nil {
			return nil, err
		}
		taipeiTime := activity.Time.In(loc) // UTC to "Aisa/Taipei" time
		activity.Time = taipeiTime
		activities = append(activities, activity)
	}
	// TODO: null array -> OK
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}
