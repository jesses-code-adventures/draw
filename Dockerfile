# syntax=docker/dockerfile:1

FROM golang:1.22-alpine as builder
WORKDIR /app
COPY . ./
EXPOSE 3000
RUN CGO_ENABLED=0 GOOS=linux go build -o /server
RUN ls -la
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /server .
COPY --from=builder /app/client ./client
COPY --from=builder /app/public ./public
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/index.html ./index.html
EXPOSE 3000
CMD ["./server"]
