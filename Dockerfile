FROM node:12-slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN  yarn config set strict-ssl false && yarn install && yarn build

FROM bitnami/nginx:1.20
#COPY --from=build-step /app/build /opt/bitnami/nginx/html/
#COPY ./dnerhs.conf /opt/bitnami/nginx/conf/


COPY --from=build-step /app/build /opt/bitnami/nginx/html/
COPY ./dnerhs-server.conf /opt/bitnami/nginx/conf/server_blocks/
