.PHONY: dev

build: 
	turbo run build

test:
	turbo run test

docker:
	docker compose build
	docker compose up -d

dev:
	docker compose watch & docker compose logs -f

clean:
	find ./ | grep /.turbo | xargs rm -r
	turbo run clean

clean-cache:
	rm -rf node_modules/.cache/turbo
