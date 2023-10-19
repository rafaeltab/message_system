FROM node:18 as base
RUN apt-get install git
RUN apt-get update
RUN npm i -g turbo
WORKDIR /app
RUN corepack enable

# Create a layer for pruning the monorepo
FROM base as pruner

# Copy the entire monorepo to the container
# An alternative would be copying only the desired app, and depended upon packages from the get go and not running turbo prune.
# This would be faster, but is less modular and requires editing the Dockerfile for each app.
# Simply personal preference here.
COPY . .
RUN turbo prune --scope=message-service --docker

# Create a layer for installing modules
FROM base AS installer

# Add lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy pruned monorepo
COPY --from=pruner /app/out/full/ .

RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

ENTRYPOINT [ "turbo", "run", "start", "--no-daemon" ]
