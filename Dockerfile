# Base image
FROM node:22.14-alpine3.21 AS base
WORKDIR /app

# Stage 1: Install all dependencies (including dev)
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: Build the app
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Stage 3: Create production image
FROM base AS runner

ENV NODE_ENV=development
ENV APP_PORT=8080

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Optional non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE $APP_PORT
CMD ["node", "--max-old-space-size=400 dist/main.js"]
