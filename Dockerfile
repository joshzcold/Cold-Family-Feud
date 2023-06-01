FROM node:18-alpine


COPY . /src
WORKDIR /src

RUN apk add ruby bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh


RUN npm ci
RUN npm run build

CMD ["npm", "run", "start"]

