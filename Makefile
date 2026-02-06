COMPOSE = docker compose
EXEC_API = $(COMPOSE) exec api

.PHONY: run run-bg restart stop clean test migrate setup logs

run:
	$(COMPOSE) up --build

run-bg:
	$(COMPOSE) up --build -d

restart:
	$(MAKE) stop
	$(MAKE) run-bg

stop:
	$(COMPOSE) down

clean:
	$(COMPOSE) down -v

test:
	$(COMPOSE) exec -e NODE_ENV=test api npm run test

migrate:
	$(EXEC_API) npx prisma migrate dev

setup:
	$(COMPOSE) up -d --build
	@echo "Aguardando o banco de dados..."
	sleep 10
	$(MAKE) migrate

logs:
	$(COMPOSE) logs -f api