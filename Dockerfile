FROM node:12.20.1-slim

RUN yarn global add serverless

ADD . /code

CMD [ "serverless", "offline", "start" ]