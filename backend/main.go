package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"plain/infrastructure"
	"plain/interface/filter"
	"plain/interface/repository"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	c := cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept", "Content-Length", "Cookie", "Referer", "Access-Control-Allow-Credentials", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Type", "Content-Length", "Set-Cookie", "X-Maintenance-StatusList", "Content-Disposition"},
		AllowCredentials: true,
		MaxAge:           -1,
	})
	r.Use(c)

	conn := infrastructure.GetMysqlConnection()
	db := infrastructure.NewDBDriver(conn)
	userRepository := repository.NewUserRepository(db)

	r.GET("/api/hello", func(c *gin.Context) {
		users, err := userRepository.Get(c.Request.Context(), &filter.UserFilter{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		user := users[0]
		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Hello, %s!", user.Name)})
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		err := srv.ListenAndServe()
		if err != nil {
			log.Fatal(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
}
