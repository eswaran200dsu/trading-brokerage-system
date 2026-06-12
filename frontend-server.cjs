const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, "dist", "client");

const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
    });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (urlPath === "/") {
      urlPath = "/index.html";
    }

    const requestedPath = path.join(root, urlPath);

    if (requestedPath.startsWith(root) && fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      return sendFile(res, requestedPath);
    }

    // React/TanStack client routes fallback
    return sendFile(res, path.join(root, "index.html"));
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Frontend running on port ${PORT}`);
  });
