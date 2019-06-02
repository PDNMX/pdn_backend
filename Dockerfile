FROM node:10-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /pdn_backend
WORKDIR /pdn_backend

RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean

EXPOSE ${PORT_GLOBAL}

CMD ["yarn", "start"]
