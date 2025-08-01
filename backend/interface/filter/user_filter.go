package filter

import (
	"gorm.io/gorm"
)

type UserFilter struct {
	Zero *bool

	ID    *int
	Email *string

	Limit  *int
	Offset *int
}

func (c *UserFilter) GenerateMods(db *gorm.DB) *gorm.DB {
	if c.Zero != nil && *c.Zero {
		return db.Where("1 = 0")
	}
	if c.ID != nil {
		db = db.Where("id = ?", *c.ID)
	}
	if c.Email != nil {
		db = db.Where("email = ?", *c.Email)
	}
	if c.Limit != nil {
		db = db.Limit(*c.Limit)
		if c.Offset != nil {
			db = db.Offset(*c.Offset)
		}
	}
	return db
}
