// @ts-check
import http from "http";
import fs from "fs";
import path from "path";

const hostname = "0.0.0.0";
const port = 3000;

const publicDirectoryPath = path.join(process.cwd(), "public");

/**
 * Function to serve files
 * @param {string} filePath
 * @param {string} contentType
 * @param {http.ServerResponse} response
 */
const serveFile = (filePath, contentType, response) => {
  console.log("Serving file", filePath);
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // If the file is not found, return a 404
        response.writeHead(404);
        response.end("Not found" + filePath);
      } else {
        // If there is any other error, return a 500
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " +
            error.code +
            " ..\n" +
            error.message,
        );
      }
    } else {
      // If no error, serve the file content
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
};

const server = http.createServer((req, response) => {
  console.log("Request for", req.url);
  if (!req.url) {
    response.writeHead(404);
    response.end("Not found" + req.url);
    return;
  }

  let baseDir = process.cwd();

  let filePath = path.join(baseDir, req.url);
  if (filePath.endsWith("/")) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(publicDirectoryPath, req.url);
  }

  // Infer the content type from the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";
  serveFile(filePath, contentType, response);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
