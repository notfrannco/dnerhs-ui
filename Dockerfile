FROM node:12-slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN  yarn config set strict-ssl false && yarn install && yarn build

FROM registry.access.redhat.com/ubi8/nginx-120
COPY --from=build-step /app/build /usr/share/nginx/html
