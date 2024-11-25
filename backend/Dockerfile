FROM golang:1.23.3-alpine as base

FROM base AS builder

RUN mkdir -p app

WORKDIR /app

COPY . .

RUN go build .

FROM base as app

RUN mkdir -p /app

WORKDIR /app

COPY --from=builder /app/Cold-Family-Feud .

CMD ["/app/Cold-Family-Feud"]
