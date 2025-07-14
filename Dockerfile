FROM node:18.18.0-bullseye-slim AS builder
ARG BACKEND_URL
ARG COMMIT_MESSAGE
ARG COMMIT_INITIATOR
ARG COMMIT_DATE
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
