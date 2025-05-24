import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const host = '194.163.163.254' // 👈 Specify your IP here
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port, host) // 👈 Add host parameter here
  
  console.log(
    `> Server listening at http://${host}:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})