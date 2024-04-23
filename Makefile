.PHONY: dev

dev:
	# docker compose build
	# docker compose up -d
	docker compose watch & docker compose logs -f

clean:
	rm -rf **/.turbo/**

clean-cache:
