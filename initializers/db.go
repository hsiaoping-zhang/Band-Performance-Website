package initializers

import (
	// "band-app/initializers"
	"fmt"
	"log"
	"os"

	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	"github.com/golang-migrate/migrate/v4/database/sqlserver"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

var DB *sql.DB

func ConnectToDB() (err error) {
	fmt.Print("enter check\n")
	var (
		dbHost     = os.Getenv("DB_HOST")
		dbUserName = os.Getenv("DB_USER")     // e.g. 'my-db-user'
		dbUserPwd  = os.Getenv("DB_PASSWORD") // e.g. 'my-db-password'
		dbName     = os.Getenv("DB_NAME")     // e.g. 'my-database'
		dbPort     = os.Getenv("DB_PORT")     // e.g. '/cloudsql/project:region:instance'
	)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUserName, dbUserPwd, dbHost, dbPort, dbName)
	// dsn := fmt.Sprintf("%s:%s@unix(%s)/%s?parseTime=true", dbUserName, dbUserPwd, dbUnixSocketPath, dbName)
	DB, err = sql.Open("mysql", dsn)

	//檢查連線
	if err := DB.Ping(); err != nil {
		fmt.Println("資料庫連線錯誤，原因為：", err.Error())
		return err
	}
	fmt.Print("connect success!!\n")

	return err
}

func ConnectToMSSQLDB() (err error) {
	fmt.Print("enter MSSQL check\n")
	var (
		dbUserName = os.Getenv("MSSQL_USER")     // e.g. 'my-db-user'
		dbUserPwd  = os.Getenv("MSSQL_PASSWORD") // e.g. 'my-db-password'
		dbName     = os.Getenv("MSSQL_DB")       // e.g. 'my-database'
		dbServer   = os.Getenv("MSSQL_SERVER")   // e.g. '/cloudsql/project:region:instance'
	)

	dsn := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s;", dbServer, dbUserName, dbUserPwd, 1433, dbName)
	DB, err = sql.Open("sqlserver", dsn)

	//檢查連線
	if err := DB.Ping(); err != nil {
		fmt.Println("MSSQL 資料庫連線錯誤，原因為：", err.Error())
		return err
	}

	fmt.Print("MSSQL connect success!!\n")
	return err
}

func RunMSSQLMigrations() {
	if err := DB.Ping(); err != nil {
		log.Fatal(err)
	}

	driver, err := sqlserver.WithInstance(DB, &sqlserver.Config{})
	if err != nil {
		log.Fatalf("Failed to create migration driver: %v", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations-sqlsever",
		"sqlserver", driver)

	if err != nil {
		log.Fatalf("Failed to initialize migrations: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Migrations applied successfully")
}

func RunMigrations() {
	var (
		dbHost     = os.Getenv("DB_HOST")
		dbUserName = os.Getenv("DB_USER")     // e.g. 'my-db-user'
		dbUserPwd  = os.Getenv("DB_PASSWORD") // e.g. 'my-db-password'
		dbName     = os.Getenv("DB_NAME")     // e.g. 'my-database'
		dbPort     = os.Getenv("DB_PORT")     // e.g. '/cloudsql/project:region:instance'
	)

	dsn := fmt.Sprintf("mysql://%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUserName, dbUserPwd, dbHost, dbPort, dbName)

	// dsn := "mysql://" + dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName
	m, err := migrate.New(
		"file://migrations",
		dsn,
	)
	if err != nil {
		log.Fatalf("Failed to initialize migrations: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Migrations applied successfully")
}
