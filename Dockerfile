FROM rust:1.75-slim as rust-builder
WORKDIR /app/src/apteka-strzelin
COPY backend backend
WORKDIR /app/src/apteka-strzelin/backend
RUN cargo install --path .

FROM node:21-bookworm-slim as react-builder
WORKDIR /app/src/apteka-strzelin
COPY frontend/ frontend/
WORKDIR /app/src/apteka-strzelin/frontend
RUN npm install
RUN npm run build
FROM debian:bookworm-slim
COPY --from=rust-builder /usr/local/cargo/bin/backend /app/backend
COPY --from=rust-builder /app/src/apteka-strzelin/backend/db.json /app/db.json
COPY --from=react-builder /app/src/apteka-strzelin/frontend/build /app/public
COPY --from=react-builder /app/src/apteka-strzelin/frontend/manifest.json /app/public
WORKDIR /app
CMD ["./backend"]