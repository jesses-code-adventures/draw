package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	mux := http.NewServeMux()
	PORT := ":3000"
	log.Println("Server started on port ", PORT)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Request received: ", r.URL.Path)
		base := filepath.Base(r.URL.Path)
		log.Println("base: ", base)
		w.Header().Set("Cache-Control", "no-cache")
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "index.html")
			return
		}
		if _, err := http.Dir("styles").Open(filepath.Base(r.URL.Path)); err == nil {
			log.Println(r.URL.Path)
			if filepath.Ext(r.URL.Path) == ".css" {
				w.Header().Set("Content-Type", "text/css")
			}
			http.ServeFile(w, r, filepath.Join("styles", filepath.Base(r.URL.Path)))
			return
		}
		if filepath.Ext(r.URL.Path) == ".js" {
			w.Header().Set("Content-Type", "application/javascript")
		}
		publicFilePath := filepath.Join("public", r.URL.Path)
		if _, err := http.Dir("public").Open(r.URL.Path); err == nil {
			http.ServeFile(w, r, publicFilePath)
			return
		}
		if _, err := http.Dir("client").Open(base); err == nil {
			clientFilePath := filepath.Join("client", filepath.Base(r.URL.Path))
			if _, err := os.Stat(clientFilePath); err == nil {
				http.ServeFile(w, r, clientFilePath)
				return
			}
			return
		}
		http.NotFound(w, r)
	})
	http.ListenAndServe(PORT, mux)
}
