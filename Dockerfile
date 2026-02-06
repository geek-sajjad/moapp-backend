
FROM node:22.14-alpine3.21

WORKDIR /app

RUN corepack enable


COPY package.json pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm run build


CMD ["node", "dist/main.js"]
