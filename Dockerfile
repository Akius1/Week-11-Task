FROM node:12.18.2

WORKDIR /usr/app

COPY package.json /usr/app/package.json

RUN yarn

COPY . /usr/app

RUN yarn tsc

RUN yarn test:unit

EXPOSE 3000

CMD ["yarn" ,"start"]