package main

import (
	"net/http"
	"path/filepath"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join("index.html"))
			return
		}

		publicFilePath := filepath.Join("public", r.URL.Path)
		if _, err := http.Dir("public").Open(r.URL.Path); err == nil {
			http.ServeFile(w, r, publicFilePath)
			return
		}

		if _, err := http.Dir("styles").Open(filepath.Base(r.URL.Path)); err == nil {
			if filepath.Ext(r.URL.Path) == ".css" {
				w.Header().Set("Content-Type", "text/css")
			}
			http.ServeFile(w, r, filepath.Join("styles", filepath.Base(r.URL.Path)))
			return
		}

		if _, err := http.Dir("client").Open(filepath.Base(r.URL.Path)); err == nil {
			http.ServeFile(w, r, filepath.Join("client", filepath.Base(r.URL.Path)))
			return
		}
		http.NotFound(w, r)
	})
	http.ListenAndServe(":3000", mux)
}
