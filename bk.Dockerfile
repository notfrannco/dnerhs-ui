FROM registrynexus.lab.data.com.py/node:slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn config set registry https://nexus.lab.data.com.py/repository/npm-proxy && yarn config set strict-ssl false && yarn install && yarn build

FROM registrynexus.lab.data.com.py/nginx:1.20.1-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
