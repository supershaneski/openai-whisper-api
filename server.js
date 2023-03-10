const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'

const hostname = '192.168.1.80'
const port = 3006

//const app = next({ dev })
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {

        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)

    }).listen(port, (err) => {
        if(err) throw err
        console.log('\x1b[35m%s\x1b[0m', 'event', `- started ssl server on https://localhost:${port}`)
    })
})

