FROM golang:1.23.3-alpine as base
RUN mkdir -p /src
WORKDIR /src

FROM base as dev
RUN go install github.com/air-verse/air@latest
CMD ["air", "--build.cmd", "go build .", "--build.bin", "/src/Cold-Family-Feud"]

FROM base AS builder
COPY . .
RUN go build .

FROM base as app
RUN mkdir -p /src
WORKDIR /src
COPY --from=games . /src/games/
COPY --from=builder --chmod=755 /src/Cold-Family-Feud /src/Cold-Family-Feud
CMD ["/src/Cold-Family-Feud"]
