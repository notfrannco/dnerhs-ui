FROM node:12-slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN  yarn config set strict-ssl false && yarn install && yarn build

FROM nginx:1.20.1-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
