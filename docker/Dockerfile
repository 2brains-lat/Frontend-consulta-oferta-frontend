FROM public.ecr.aws/nginx/nginx:latest

RUN rm -f /etc/nginx/conf.d/default.conf 
COPY docker/default.conf /etc/nginx/conf.d/
RUN mkdir /usr/share/nginx/html/login
COPY docker/html/index.html  /usr/share/nginx/html/login
COPY docker/html/index.css  /usr/share/nginx/html/login
RUN mkdir /usr/share/nginx/html/msal
COPY dist/apps/msal-login /usr/share/nginx/html/msal
RUN mkdir /usr/share/nginx/html/v1
RUN mkdir /usr/share/nginx/html/v1/vta
COPY dist/apps/ventas /usr/share/nginx/html/v1/vta
RUN mkdir /usr/share/nginx/html/v1/mkt
RUN mkdir /usr/share/nginx/html/v1/admin
COPY dist/apps/marketing /usr/share/nginx/html/v1/mkt
COPY dist/apps/admin /usr/share/nginx/html/v1/admin

RUN mkdir /usr/share/nginx/html/v1/back-office
COPY dist/apps/back-office /usr/share/nginx/html/v1/back-office

RUN ls -la usr/share/nginx/html/*


EXPOSE 8080