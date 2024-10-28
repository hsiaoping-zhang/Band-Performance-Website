package models

import (
	"database/sql"
	"fmt"
	"time"

	"band-app/enum"
	// "github.com/go-sql-driver/mysql"
	// "gorm.io/gorm"
)

type User struct {
	// gorm.Model
	Id            int        `json:"id"`
	Name          string     `json:"name"`
	Email         string     `json:"email"`
	PermissionId  string     `json:"permission_id"`
	LastLoginTime time.Time  `json:"last_login_time"`
	Level         enum.Level `json:"level"`
	CreatedTime   time.Time  `json:"created_time"`
	// ApplyTime     time.Time `json:"apply_time"`
	IsValid bool `json:"is_valid"`
}

func GetUserByEmail(db *sql.DB, userEmail string) (User, error) {
	fmt.Print("model: GetUserByEmail\n")

	var targetUser User
	fmt.Print("userEmail:", userEmail, "\n")
	query := "SELECT id, name, email, permission_id, level, is_valid FROM user WHERE email = ?"
	row := db.QueryRow(query, userEmail)
	fmt.Print(query, "\n")

	if err := row.Scan(&targetUser.Id, &targetUser.Name, &targetUser.Email, &targetUser.PermissionId, &targetUser.Level, &targetUser.IsValid); err != nil {
		return targetUser, err
	}

	fmt.Print("result", targetUser, "\n")

	return targetUser, nil
}

func GetUserByPermissionId(db *sql.DB, userPermissionId string) (User, error) {
	fmt.Print("model: GetUserByPermissionId\n")

	var targetUser User
	fmt.Print("userPermissionId:", userPermissionId, "\n")
	query := "SELECT id, name, email, permission_id, last_login_time, level, is_valid FROM user WHERE permission_id = ?"
	row := db.QueryRow(query, userPermissionId)
	fmt.Print(query, "\n")

	if err := row.Scan(&targetUser.Id, &targetUser.Name, &targetUser.Email, &targetUser.PermissionId, &targetUser.LastLoginTime, &targetUser.Level, &targetUser.IsValid); err != nil {
		return targetUser, err
	}

	loc, _ := time.LoadLocation("Asia/Taipei")
	taipeiTimeLastLoginTime := targetUser.LastLoginTime.In(loc) // UTC to "Aisa/Taipei" time
	targetUser.LastLoginTime = taipeiTimeLastLoginTime

	taipeiTimeCreatedTime := targetUser.CreatedTime.In(loc)
	targetUser.CreatedTime = taipeiTimeCreatedTime

	fmt.Print("result", targetUser, "\n")

	return targetUser, nil
}

func CreateApplyUser(db *sql.DB, user User) (int64, error) {
	fmt.Print("model: CreateApplyUser\n")

	query := "INSERT INTO user (name, email, permission_id, last_login_time, level, created_time, is_valid) VALUES (?, ?, ?, ?, ?, ?, ?)"

	// 執行插入操作
	result, err := db.Exec(query, user.Name, user.Email, user.PermissionId, user.LastLoginTime, user.Level, user.CreatedTime, user.IsValid)
	if err != nil {
		fmt.Print(user.Name, "\n")
		fmt.Print(err)
		return -1, err
	}

	// 取得自動生成的 ID
	returnId, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}

	return returnId, err
}

func RecordLoginTime(db *sql.DB, permissionId string) error {
	fmt.Print("RecordLoginTime\n")
	query := "UPDATE user SET last_login_time = ? WHERE permission_id = ?"
	if _, err := db.Exec(query, time.Now(), permissionId); err != nil {
		return err
	}
	return nil
}

func GetUnApprovedUsers(db *sql.DB) ([]User, error) {
	query := "SELECT id, email, name FROM user WHERE is_valid = false"
	// row := db.QueryRow(query)
	var unapprovedUsers []User

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Id, &user.Email, &user.Name); err != nil {
			return nil, err
		}
		unapprovedUsers = append(unapprovedUsers, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	fmt.Print("result", unapprovedUsers, "\n")
	return unapprovedUsers, err
}

func ApproveUser(db *sql.DB, email string) error {
	query := "UPDATE user SET is_valid = true WHERE email = ?"
	if _, err := db.Exec(query, email); err != nil {
		return err
	}
	return nil
}
