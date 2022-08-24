FROM node:12-slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN  yarn config set strict-ssl false && yarn install && yarn build

FROM nginx-120
#FROM nginx:1.19.10
#FROM nginx:1.20 # este funciona en puerto 80
COPY --from=build-step /app/build /usr/share/nginx/html
