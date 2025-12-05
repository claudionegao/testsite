import { Server } from 'socket.io'
import { NextResponse } from 'next/server'

/**
 * Socket.io API Route Handler for Next.js App Router
 * 
 * This file should be placed at: app/api/socket/route.js
 * 
 * Usage:
 * 1. Copy this file to your Next.js project at app/api/socket/route.js
 * 2. The socket server will be automatically initialized when accessed
 * 3. All events are broadcasted to all connected clients
 */

export async function GET(request) {
  const res = NextResponse.next()
  
  // @ts-ignore - Socket.io attaches to the server instance
  if (res.socket?.server?.io) {
    console.log('Socket.io server is already running')
  } else {
    console.log('Initializing Socket.io server...')
    // @ts-ignore
    const io = new Server(res.socket?.server, {
      path: '/socket.io',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })
    
    // @ts-ignore
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
  
  return new Response('Socket.io server is running', { status: 200 })
}
