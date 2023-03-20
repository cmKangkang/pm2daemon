const { createServer } = require('node:http')
const pino = require('pino')

const logger = pino()

process.on("message", (msg) => {
  logger.info({
    pid: process.pid,
    appName: "simple-server2",
    msg
  })

  process.send({
    type : 'process:msg',
    data : {
      success : true,
      from: 'simple-server2'
    }
  })
})

const server = createServer((req, res) => {
  res.end('hello world')
})

server.listen(8000)

console.log("server listening at prot 8000")