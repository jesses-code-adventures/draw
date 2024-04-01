package server

import (
    "net/http"
    "strings"
)

type Server struct {
    s http.Server
}

func NewServer(address string, handler http.Handler) *Server {
    if !strings.HasPrefix(address, ":") {
        address = ":" + address
    }
    return &Server{s: http.Server{
        Addr: address,
        Handler: handler,
    }}
}
