package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
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

	r.Run(":8080")
}
