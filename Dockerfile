FROM node:20-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

FROM base AS builder

COPY package-lock.json package.json /src/
WORKDIR /src
RUN npm install

FROM base AS dev
RUN apk add curl
COPY --from=builder /src/node_modules/ /src/node_modules/
COPY . /src/
WORKDIR /src
CMD ["npm", "run", "dev"]

FROM base AS app
COPY --from=builder /src/node_modules/ /src/node_modules/
COPY . /src/
WORKDIR /src
RUN npm run build
COPY --chmod=775 docker/frontend-start.sh /src/start.sh

CMD ["/src/start.sh"]
