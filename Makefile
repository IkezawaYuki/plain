.PHONY: init dev migrate-up migrate-down migrate-status migrate-new

dev:
	docker compose down
	docker compose up --build -d
	docker compose ps

migrate-new:
	@read -p "Migration name: " name; \
	cd backend && sql-migrate new -config=dbconfig.yml "$$name"

# Docker Migration Commands  
migrate-up:
	docker-compose exec backend sql-migrate up -config=dbconfig.yml

migrate-down:
	docker-compose exec backend sql-migrate down -config=dbconfig.yml

migrate-status:
	docker-compose exec backend sql-migrate status -config=dbconfig.yml