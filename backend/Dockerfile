FROM node:carbon-alpine
ENV NODE_ENV=prod
## 配置 apk包加速镜像为阿里
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk update \
    && apk add tzdata \
    && rm -rf /var/cache/apk/*
WORKDIR /blog-backend
COPY . /blog-backend
VOLUME [ "/root/logs", "/blog-backend/OutPut" ]
EXPOSE 7001
CMD [ "npm", "run", "start:docker" ]