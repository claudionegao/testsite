#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

console.log('\n🚀 EasySocket Manual Setup\n')

const projectDir = process.cwd()

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function setup() {
  console.log('Which Next.js router are you using?')
  console.log('1. Pages Router (pages/)')
  console.log('2. App Router (app/)')
  
  const routerChoice = await askQuestion('Choose (1 or 2): ')
  const useAppRouter = routerChoice.trim() === '2'

  let targetDir, targetFile

  if (useAppRouter) {
    targetDir = path.join(projectDir, 'app', 'api', 'socket')
    targetFile = path.join(targetDir, 'route.js')
  } else {
    targetDir = path.join(projectDir, 'pages', 'api')
    targetFile = path.join(targetDir, 'socket.js')
  }

  if (fs.existsSync(targetFile)) {
    console.log(`\n✅ File already exists: ${path.relative(projectDir, targetFile)}`)
    const overwrite = await askQuestion('Overwrite? (y/N): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n✨ Setup cancelled.\n')
      process.exit(0)
    }
  }

  if (!fs.existsSync(targetDir)) {
    console.log(`\n📁 Creating directory: ${path.relative(projectDir, targetDir)}`)
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const pagesRouterContent = `const { Server } = require('socket.io')

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
        console.log(\`Event received: \${eventName}\`, args)
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
`

  const appRouterContent = `import { Server } from 'socket.io'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const res = NextResponse.next()
  
  // @ts-ignore
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

      socket.onAny((eventName, ...args) => {
        console.log(\`Event received: \${eventName}\`, args)
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
`

  const content = useAppRouter ? appRouterContent : pagesRouterContent

  try {
    fs.writeFileSync(targetFile, content, 'utf8')
    console.log(`\n✅ Created: ${path.relative(projectDir, targetFile)}`)
    console.log('\n✨ Setup complete!\n')
    console.log('📖 Next steps:')
    console.log('   import socket from "easysocket"')
    console.log('   await socket.connect()')
    console.log('   socket.emit("myEvent", { data: "hello" })')
    console.log('   socket.on("myEvent", (payload) => console.log(payload))\n')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

setup().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
