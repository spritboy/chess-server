import * as ws from 'nodejs-websocket'

const PORT = 3000

// 每次只要有用户连接，函数就会被执行，会给当前连接的用户创建一个connect对象
const server = ws.createServer((connect) => {
  console.log('有用户连接上来: ', connect.headers.host)
  connect.userName = `用户${connect.headers.host}`
  // 广播所有用户，有人加入了聊天室
  broadcast(`${connect.userName}进入了聊天室`)

  connect.on('text', (data) => {
    console.log('接收到了用户的数据: ', data)
    connect.sendText(
      JSON.stringify({
        cmd: 'message',
        msgData: 'success',
      }),
    )
  })
  connect.on('close', () => {
    console.log('连接断开了')
  })

  connect.on('error', () => {
    console.log('用户连接异常')
  })
})

// 广播，给所有用户发送消息
function broadcast(msg) {
  // server.connections: 表示所有的用户
  server.connections.forEach((item) => {
    item.send(
      JSON.stringify({
        msg,
        cmd: 'send',
      }),
    )
  })
}

server.listen(PORT, () => {
  console.log('websocket服务启动成功, 监听了端口', PORT)
})
