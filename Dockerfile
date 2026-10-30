# docker build -t syncloom-homepage .   &&   docker run -p 8080:80 syncloom-homepage
FROM hugomods/hugo:exts AS build
WORKDIR /src
COPY . .
RUN hugo --minify --gc

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/public /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
