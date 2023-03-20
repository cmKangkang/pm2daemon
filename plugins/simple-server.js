const { createServer } = require('node:http')

process.on("message", (msg) => {
  logger.info({
    pid: process.pid,
    appName: "simple-server",
    msg
  })
  
  process.send({
    type : 'process:msg',
    data : {
      success : true,
      from: 'simple-server'
    }
  })
})

const server = createServer((req, res) => {
  res.end('hello world')
})

server.listen(10010)

console.log("server listening at prot 10010")