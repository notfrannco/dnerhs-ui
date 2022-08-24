FROM node:12-slim as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN  yarn config set strict-ssl false && yarn install && yarn build

#FROM nginx-120
#FROM nginx:1.19.10
#FROM nginx:1.20 # este funciona en puerto 80
#FROM registry.access.redhat.com/rhscl/nginx-120-rhel7
#COPY --from=build-step /app/build /usr/share/nginx/html



FROM nginx:1.17
COPY --from=build-step /app/build /usr/share/nginx/html
RUN mkdir -p /opt/app && chown -R nginx:nginx /opt/app && chmod -R 775 /opt/app
RUN sed -i 's/listen       80/listen       8080/' /etc/nginx/nginx.conf
RUN chown -R nginx:nginx /var/cache/nginx && \
   chown -R nginx:nginx /var/log/nginx && \
   chown -R nginx:nginx /usr/share/nginx/html && \
   chown -R nginx:nginx /etc/nginx && \
   chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
   chown -R nginx:nginx /var/run/nginx.pid
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid && \
   chmod -R 775 /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid
EXPOSE 8080
USER nginx
