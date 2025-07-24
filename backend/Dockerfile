FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o plain main.go
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

FROM alpine:latest
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /app
COPY --from=builder /app/plain .
EXPOSE 8080
CMD ["./plain"]