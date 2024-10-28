package models

import (
	"database/sql"
	"fmt"
	"strings"
	"time"
)

func CreatePerformerActivity(db *sql.DB, performers string, activityId int) error {

	performersArray := strings.Split(performers, ",")

	placeholders := make([]string, len(performersArray))
	args := make([]interface{}, len(performersArray)+1)
	args[0] = activityId

	for i, performer := range performersArray {
		placeholders[i] = "(?)" // 每個值對應一個佔位符
		args[i+1] = performer   // 將樂團名稱添加到 values 切片中
	}

	query := fmt.Sprintf("INSERT INTO PerformerActivity (performer_id, activity_id) "+
		"SELECT id, ? FROM performer where name IN (%s)", strings.Join(placeholders, ", "))

	if _, err := db.Exec(query, args...); err != nil {
		return err
	}

	return nil
}

func DeleteActivityInPerformerActivity(db *sql.DB, activityId string) (int64, error) {
	queryPerformerActivity := "DELETE FROM performerActivity WHERE activity_id = ?"
	result, err := db.Exec(queryPerformerActivity, activityId)
	if err != nil {
		return 0, err
	} else {
		rowsAffected, _ := result.RowsAffected()
		return rowsAffected, nil
	}

}

func GetPerformerActivity(db *sql.DB, performerName string) ([]Activity, error) {
	query := `SELECT activity.id, activity.name, activity.time, activity.area, activity.loc, activity.is_free, activity.note, activity.city, activity.performers
		FROM performerActivity 
		JOIN activity ON activity.id = performerActivity.activity_id
		WHERE performer_id = (SELECT id FROM performer WHERE name = ?) AND YEARWEEK(activity.time, 1) >= YEARWEEK(CURDATE(), 1) ORDER BY time ASC`
	rows, err := db.Query(query, performerName)
	if err != nil {
		return nil, err
	}
	fmt.Print("ok\n")

	// defer rows.Close()
	loc, _ := time.LoadLocation("Asia/Taipei")

	var activities []Activity
	for rows.Next() {
		var activity Activity
		if err := rows.Scan(&activity.Id, &activity.Name, &activity.Time, &activity.Area, &activity.Location, &activity.IsFree, &activity.Note, &activity.City, &activity.Performers); err != nil {
			return nil, err
		}
		taipeiTime := activity.Time.In(loc) // UTC to "Aisa/Taipei" time
		activity.Time = taipeiTime
		fmt.Print(activity)
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}
