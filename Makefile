build:
	docker-compose -f docker/docker-compose.yml build
run:
	docker-compose -f docker/docker-compose.yml up -d
dev:
	docker exec -it demogrid bash
down:
	docker-compose -f docker/docker-compose.yml down -v
