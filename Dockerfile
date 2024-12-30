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

CMD ["npm", "run", "start"]
