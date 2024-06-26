FROM rust:slim AS builder

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev g++ libsasl2-dev 
RUN update-ca-certificates

WORKDIR /app

COPY . .

RUN cargo build --target x86_64-unknown-linux-musl --release

FROM alpine as notification-service
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/notification-service ./
CMD [ "./notification-service" ]

