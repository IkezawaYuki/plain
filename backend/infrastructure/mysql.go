package infrastructure

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"plain/config"
)

func GetMysqlConnection() *gorm.DB {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.Env.DBUser,
		config.Env.DBPass,
		config.Env.DBHost,
		config.Env.DBPort,
		config.Env.DBName,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err.Error())
	}
	return db
}

type Transaction interface {
	Commit() error
	Rollback()
	GetTx() *gorm.DB
}

type Tx struct {
	tx *gorm.DB
}

func (t *Tx) Commit() error {
	return t.tx.Commit().Error
}

func (t *Tx) Rollback() {
	t.tx.Rollback()
}

func (t *Tx) GetTx() *gorm.DB {
	return t.tx
}
