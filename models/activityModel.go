package models

import (
	"fmt"
	"time"

	"database/sql"
)

type Activity struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	Time       time.Time `json:"time"`
	Area       string    `json:"area"`
	City       string    `json:"city"`
	Location   string    `json:"location"`
	Performers string    `json:"performers"`
	IsFree     bool      `json:"is_free"`
	Note       string    `json:"note"`
}

func GetDefaultActivity(db *sql.DB) ([]Activity, error) {
	fmt.Print("model: GetDefaultActivity\n")
	var activities []Activity
	query := "SELECT id, name, time, city, area, loc, performers, is_free, note FROM activity WHERE YEARWEEK(time, 1) = YEARWEEK(CURDATE(), 1) ORDER BY time ASC"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	loc := time.FixedZone("CST", 8*60*60) // 定義 UTC+8 時區

	for rows.Next() {
		var activity Activity
		if err := rows.Scan(&activity.Id, &activity.Name, &activity.Time, &activity.City, &activity.Area, &activity.Location, &activity.Performers, &activity.IsFree, &activity.Note); err != nil {
			return nil, err
		}
		taipeiTime := activity.Time.In(loc) // UTC to "Aisa/Taipei" time
		activity.Time = taipeiTime
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}

func GetAllActivityList(db *sql.DB) ([]Activity, error) {
	fmt.Print("model: GetActivityList\n")
	var activities []Activity
	query := "SELECT id, name, time, city, area, loc, performers, is_free, note FROM activity WHERE YEARWEEK(time, 1) >= YEARWEEK(CURDATE(), 1) ORDER BY time ASC"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	loc := time.FixedZone("CST", 8*60*60)

	for rows.Next() {
		var activity Activity
		if err := rows.Scan(&activity.Id, &activity.Name, &activity.Time, &activity.City, &activity.Area, &activity.Location, &activity.Performers, &activity.IsFree, &activity.Note); err != nil {
			return nil, err
		}
		taipeiTime := activity.Time.In(loc) // UTC to "Aisa/Taipei" time
		activity.Time = taipeiTime
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}

func GetWeekActivity(db *sql.DB, week string) ([]Activity, error) {
	fmt.Print("model: GetWeekActivity\n")
	var activities []Activity
	query := "SELECT id, name, time, city, area, loc, performers, is_free, note FROM activity WHERE YEARWEEK(time, 1) - YEARWEEK(CURDATE(), 1) = ? ORDER BY time ASC"
	rows, err := db.Query(query, week)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	loc := time.FixedZone("CST", 8*60*60)

	for rows.Next() {
		var activity Activity
		if err := rows.Scan(&activity.Id, &activity.Name, &activity.Time, &activity.City, &activity.Area, &activity.Location, &activity.Performers, &activity.IsFree, &activity.Note); err != nil {
			return nil, err
		}
		taipeiTime := activity.Time.In(loc) // UTC to "Aisa/Taipei" time
		activity.Time = taipeiTime
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}

func GetActivityById(db *sql.DB, activityId string) (Activity, error) {
	fmt.Print("model: GetActivityById\n")

	var selectedActivity Activity
	query := "SELECT id, name, time, city, area, loc, performers, is_free, note FROM activity where id = ?"
	row := db.QueryRow(query, activityId)

	if err := row.Scan(&selectedActivity.Id, &selectedActivity.Name, &selectedActivity.Time, &selectedActivity.City,
		&selectedActivity.Area, &selectedActivity.Location, &selectedActivity.Performers, &selectedActivity.IsFree, &selectedActivity.Note); err != nil {
		return selectedActivity, err
	}

	loc := time.FixedZone("CST", 8*60*60)
	taipeiTime := selectedActivity.Time.In(loc) // UTC to "Aisa/Taipei" time
	selectedActivity.Time = taipeiTime

	return selectedActivity, nil
}

func CreateActivity(db *sql.DB, activity Activity) (int64, error) {
	fmt.Print("model: CreateActivity\n")

	query := "INSERT INTO activity (name, city, area, loc, time, is_free, performers, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	result, err := db.Exec(query, activity.Name, activity.City, activity.Area, activity.Location, activity.Time, activity.IsFree, activity.Performers, activity.Note)
	if err != nil {
		fmt.Print(activity.Time, "\n")
		fmt.Print(err)
		return -1, err
	}

	returnId, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}

	return returnId, err
}

func UpdateActivity(db *sql.DB, activityId string, activity Activity) error {
	query := "UPDATE activity SET name = ?, city = ?, area = ?, loc = ?, time = ?, is_free = ?, performers = ?, note = ? WHERE id = ?"
	_, err := db.Exec(query, activity.Name, activity.City, activity.Area, activity.Location, activity.Time, activity.IsFree, activity.Performers, activity.Note, activityId)
	if err != nil {
		return err
	}
	return nil
}

func DeleteActivity(db *sql.DB, activityId string) (int64, error) {
	queryActivity := "DELETE FROM activity WHERE id = ?"
	result, err := db.Exec(queryActivity, activityId)
	if err != nil {
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}
