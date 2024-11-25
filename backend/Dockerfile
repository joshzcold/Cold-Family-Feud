FROM golang:1.23.3-alpine as base
RUN mkdir -p /src
WORKDIR /src

FROM base AS builder
COPY . .
RUN go build .

FROM base as dev
RUN go install github.com/air-verse/air@latest
COPY --from=builder --chmod=755 /src/Cold-Family-Feud /src/Cold-Family-Feud
CMD ["air", "--build.cmd", "go build .", "--build.bin", "/src/Cold-Family-Feud"]

FROM base as app
RUN mkdir -p /src
WORKDIR /src
COPY --from=builder --chmod=755 /src/Cold-Family-Feud /src/Cold-Family-Feud
CMD ["/src/Cold-Family-Feud"]
