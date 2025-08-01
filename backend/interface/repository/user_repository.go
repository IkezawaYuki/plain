package repository

import (
	"context"
	"plain/domain/model"
	"plain/infrastructure"
	"plain/interface/filter"
)

type UserRepository interface {
	Get(ctx context.Context, f *filter.UserFilter) ([]*model.User, error)
}

func NewUserRepository(dbDriver infrastructure.DBDriver) UserRepository {
	return &userRepository{
		dbDriver: dbDriver,
	}
}

type userRepository struct {
	dbDriver infrastructure.DBDriver
}

func (r *userRepository) Get(ctx context.Context, f *filter.UserFilter) ([]*model.User, error) {
	var users []*model.User
	err := r.dbDriver.Find(ctx, &users, f)
	if err != nil {
		return nil, err
	}
	return users, nil
}
