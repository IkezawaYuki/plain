.PHONY: init dev

dev:
	docker compose down
	docker compose up --build -d
	docker compose ps