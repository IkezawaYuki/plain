package main

import (
	"context"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
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

	r.GET("/api/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hello from Go"})
	})

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		err := srv.ListenAndServe()
		if err != nil {
			panic(err)
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
