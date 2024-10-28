package initializers

import (
	"fmt"
	"os"

	// "gorm.io/driver/postgres"
	"database/sql"
	// "gorm.io/gorm"
	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

// var DB *gorm.DB

func ConnectToDB() (err error) {
	fmt.Print("enter check")
	dbUserName, dbUserPwd := os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD")
	dbPort, dbName := os.Getenv("DB_PORT"), os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUserName, dbUserPwd, dbHost, dbPort, dbName)
	// fmt.Print(dbUserName + ":" + dbUserPwd + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?parseTime=true\n")
	DB, err = sql.Open("mysql", dsn)

	//檢查連線
	if err := DB.Ping(); err != nil {
		fmt.Println("資料庫連線錯誤，原因為：", err.Error())
		return err
	}

	if err := CreateTable(DB); err != nil {
		fmt.Println("資料庫建表錯誤，原因為：", err.Error())
		return err
	}

	return err
}

func CreateTable(db *sql.DB) error {
	sql := `CREATE TABLE IF NOT EXISTS activity(
	id INT(4) PRIMARY KEY AUTO_INCREMENT NOT NULL,
        name VARCHAR(64),
		time TIME,
        area VARCHAR(32),
		location VARCHAR(64)
	);`

	if _, err := db.Exec(sql); err != nil {
		fmt.Println("建立 Table 發生錯誤:", err)
		return err
	}

	sql = `CREATE TABLE IF NOT EXISTS user(
		id INT(4) PRIMARY KEY AUTO_INCREMENT NOT NULL,
			name VARCHAR(64),
			email VARCHAR(128),
			permission_id VARCHAR(32),
			last_login_time TIME,
			level VARCHAR(16)
		);`
	if _, err := db.Exec(sql); err != nil {
		fmt.Println("建立 Table 發生錯誤:", err)
		return err
	}

	fmt.Println("建立 Table 成功！")
	return nil
}

// func CreateActivity(Ac) error {
// 	query := `INSERT INTO "teacher" ("create_time", "firstname", "lastname") VALUES (NOW(), ?, ?)
// 	`
// }
