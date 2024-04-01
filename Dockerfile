# syntax=docker/dockerfile:1

FROM golang:1.22-alpine as builder
WORKDIR /app
COPY . ./
EXPOSE 3000
RUN CGO_ENABLED=0 GOOS=linux go build -o /server

# Node.js stage for minifying JavaScript
FROM node:14-alpine as js-builder
WORKDIR /app
# Assuming your JavaScript files are located in /app/client/js
COPY --from=builder /app/client ./client
# Install terser for minification
RUN npm install -g terser
# Minify all JavaScript files in the directory
RUN find ./client -name "*.js" -exec echo Minifying {} \; -exec terser {} -o {} \;

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /server .
# Copy minified JavaScript files
COPY --from=js-builder /app/client ./client
COPY --from=builder /app/public ./public
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/index.html ./index.html
EXPOSE 3000
CMD ["./server"]
