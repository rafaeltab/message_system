FROM node:18 as base
RUN apt-get install git
RUN apt-get update
RUN npm i -g turbo
WORKDIR /app
RUN corepack enable

COPY . .

RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

ENTRYPOINT [ "turbo", "run", "dev", "--no-daemon", "--filter=socket-service" ]
