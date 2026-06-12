const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "..", "dist", "client", "assets");
const outDir = path.join(__dirname, "..", "dist", "client");

const files = fs.readdirSync(assetsDir);

const jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!jsFile) {
  throw new Error("Main index JS file not found in dist/client/assets");
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TradeDesk Brokerage</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("Created dist/client/index.html");
