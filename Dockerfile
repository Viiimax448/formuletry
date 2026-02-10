FROM rust:alpine AS base

RUN apk add --no-cache musl-dev pkgconfig openssl-libs-static openssl-dev

FROM base AS builder-base
WORKDIR /usr/src/app

COPY Cargo.lock .
COPY Cargo.toml .

COPY realtime realtime
COPY shared shared
COPY signalr signalr

FROM builder-base AS builder
RUN cargo build --release --bin realtime


# Default target for Railway (REALTIME only)
FROM alpine:3
RUN apk add --no-cache ca-certificates
COPY --from=builder /usr/src/app/target/release/realtime .
EXPOSE 80
CMD [ "./realtime" ]
