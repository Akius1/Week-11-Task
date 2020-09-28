FROM node:12.18.2

WORKDIR /usr/app

COPY package.json /usr/app/package.json

RUN yarn

COPY . /usr/app

RUN yarn tsc

EXPOSE 3000

CMD ["yarn" ,"start"]