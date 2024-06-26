FROM rust:slim AS builder

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools \ 
    musl-dev \
    protobuf-compiler \
    libprotobuf-dev \
    build-essential \
    curl \
    openssl libssl-dev \
    pkg-config \
    python3 \
    valgrind \
    zlib1g-dev \
    libsasl2-dev 

RUN update-ca-certificates
RUN cargo install cargo-watch


WORKDIR /app

# copy entire workspace
COPY . .

FROM builder as notification-service
WORKDIR /app/services/notification
CMD [ "cargo", "watch", "-x", "run" ]

