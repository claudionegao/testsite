const { Server } = require('socket.io')

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket.io server is already running')
  } else {
    console.log('Initializing Socket.io server...')
    const io = new Server(res.socket.server, {
      path: '/socket.io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })
    
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.onAny((eventName, ...args) => {
        console.log(`Event received: ${eventName}`, args)
        io.emit(eventName, ...args)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    console.log('Socket.io server initialized successfully')
  }
  
  res.end()
}

export default SocketHandler
