const { Server } = require('socket.io')

/**
 * Socket.io API Route Handler for Next.js
 * 
 * This file should be placed at: pages/api/socket.js
 * 
 * Usage:
 * 1. Copy this file to your Next.js project at pages/api/socket.js
 * 2. The socket server will be automatically initialized when accessed
 * 3. All events are broadcasted to all connected clients
 */

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

      // Listen to all events and broadcast to all clients
      socket.onAny((eventName, ...args) => {
        console.log(`Event received: ${eventName}`, args)
        // Broadcast to all clients including sender
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
