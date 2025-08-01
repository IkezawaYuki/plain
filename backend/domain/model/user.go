package model

import "time"

type User struct {
	ID        int64     `gorm:"column:id;primaryKey"`
	Email     string    `gorm:"column:email"`
	Name      string    `gorm:"column:name"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
}
