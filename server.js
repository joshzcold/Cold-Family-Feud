const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const fs = require('fs')
const handle = app.getRequestHandler()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const httpsOptions = {
  key: fs.readFileSync('./dev/cert/localhost.key'),
  cert: fs.readFileSync('./dev/cert/localhost.crt')
};

const PORT = process.env.PORT || 3000;
app.prepare().then(async () => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on https://localhost:${PORT}`)
  })
})
