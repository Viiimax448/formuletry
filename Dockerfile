FROM rust:alpine AS base

RUN apk add --no-cache musl-dev pkgconfig openssl-libs-static openssl-dev

FROM base AS builder-base
WORKDIR /usr/src/app

COPY Cargo.lock .
COPY Cargo.toml .

COPY realtime realtime
COPY shared shared
COPY signalr signalr
COPY api api
COPY simulator simulator

FROM builder-base AS builder
RUN cargo b -r -p realtime -p api


# Alternative target (API)
FROM alpine:3 AS api
COPY --from=builder /usr/src/app/target/release/api .
RUN mkdir -p /target/release && ln -sf /api /target/release/api
CMD [ "/api" ]


# Default target (Realtime)
FROM alpine:3
COPY --from=builder /usr/src/app/target/release/realtime .
RUN mkdir -p /target/release && ln -sf /realtime /target/release/api && ln -sf /realtime /api
CMD [ "/realtime" ]
