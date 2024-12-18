FROM golang:1.23.3-alpine as base
RUN mkdir -p /src
WORKDIR /src

FROM base as dev
ENV CGO_ENABLED 1
RUN apk add gcc musl-dev sqlite
RUN go install github.com/air-verse/air@latest
COPY --from=games . /src/games/
COPY . .
RUN go mod download
CMD ["air", "--build.cmd", "go build .", "--build.bin", "/src/Cold-Friendly-Feud"]

FROM base AS builder
ENV CGO_ENABLED 1
RUN apk add gcc musl-dev
COPY . .
RUN go build .

FROM base as app
RUN mkdir -p /src
WORKDIR /src
COPY --from=games . /src/games/
COPY --from=builder --chmod=755 /src/Cold-Friendly-Feud /src/Cold-Family-Feud
CMD ["/src/Cold-Friendly-Feud"]
