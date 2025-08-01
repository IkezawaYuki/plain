.PHONY: init dev migrate-new migrate-up migrate-down migrate-status
dev:
	docker compose down
	docker compose up --build -d
	docker compose ps

migrate-new:
	@read -p "Migration name: " name; \
	docker-compose exec backend sql-migrate new -config=dbconfig.yml -env=default "$$name"

# Docker Migration Commands  
migrate-up:
	docker-compose exec backend sql-migrate up -config=dbconfig.yml -env=default 

migrate-down:
	docker-compose exec backend sql-migrate down -config=dbconfig.yml -env=default 

migrate-status:
	docker-compose exec backend sql-migrate status -config=dbconfig.yml -env=default 

db:
	docker exec -it plain_mysql mysql -u plain_user -pplainpassword plain_db