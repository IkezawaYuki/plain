FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
RUN go install github.com/rubenv/sql-migrate/...@latest
COPY . .
RUN go build -o plain main.go
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

FROM alpine:latest
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /go/bin/sql-migrate /usr/local/bin/sql-migrate
RUN chmod +x /usr/local/bin/sql-migrate
WORKDIR /app
COPY --from=builder /app/plain .
COPY migrations ./migrations

RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 8080
CMD ["./plain"]