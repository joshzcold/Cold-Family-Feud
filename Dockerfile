FROM node:18-alpine AS base
FROM base AS builder

COPY package-lock.json package.json /src/
WORKDIR /src
RUN npm install

FROM base AS dev
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
