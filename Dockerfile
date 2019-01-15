FROM node:10-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /pdn_backend
WORKDIR /pdn_backend

RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean

EXPOSE 3000

CMD ["yarn", "start"]
