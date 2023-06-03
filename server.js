const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const fs = require("fs");
const handle = app.getRequestHandler();

let httpsOptions = {};
var { createServer } = require("http");
if (dev) {
  var { createServer } = require("https");
  httpsOptions = {
    key: fs.readFileSync("./dev/cert/localhost.key"),
    cert: fs.readFileSync("./dev/cert/localhost.crt"),
  };
}

const PORT = process.env.PORT || 3000;
app.prepare().then(async () => {
  createServer(httpsOptions, (req, res) => {
    const logoRgex = /\/rooms\/([A-Z]{4})\/logo.(jpeg|gif|png)/
    if(logoRgex.test(req.url)) {
        const matched = req.url.match(logoRgex)
        fs.readFile(`./public/rooms/${matched[1]}/logo.${matched[2]}`, function(err, data) {
            res.end(data);
        });
    }else{
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${PORT}`);
  });
});
