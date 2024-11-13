# # syntax = docker/dockerfile:1

FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

# 確保 migrations 資料夾被複製
COPY migrations /app/migrations 

# COPY wait-for-it.sh /app/wait-for-it.sh

# 確保腳本在容器中可執行
# RUN chmod +x /app/wait-for-it.sh 

RUN CGO_ENABLED=0 go build -o main .

FROM alpine:latest

# 安裝 bash
# RUN apk add --no-cache bash

RUN apk add --no-cache mysql-client

RUN apk --no-cache add ca-certificates


WORKDIR /root/

# 將視圖檔案複製到映像中
COPY views/ ./views

COPY --from=builder /app/main .

COPY --from=builder /app/.env .

COPY --from=builder /app/views ./views

# 確保在這裡也複製
COPY --from=builder /app/migrations ./migrations

# 開放容器埠號
EXPOSE 8080

CMD ["./main"]
