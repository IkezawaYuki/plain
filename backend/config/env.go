package config

import (
	"github.com/kelseyhightower/envconfig"
	"log"
)

type Environment struct {
	RedisHost string `envconfig:"REDIS_HOST"`
	RedisPort int    `envconfig:"REDIS_PORT"`
	DBUser    string `envconfig:"DB_USER"`
	DBPort    string `envconfig:"DB_PORT"`
	DBPass    string `envconfig:"DB_PASSWORD"`
	DBName    string `envconfig:"DB_NAME"`
	DBHost    string `envconfig:"DB_HOST"`
}

var Env Environment

func init() {
	if err := envconfig.Process("", &Env); err != nil {
		log.Fatal(err)
	}
}
