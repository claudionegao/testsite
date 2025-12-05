#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

console.log('\n🚀 EasySocket Setup\n')

// Detecta o diretório do projeto
const projectDir = process.cwd()

// Detecta qual tipo de roteamento o Next.js está usando
const hasAppDir = fs.existsSync(path.join(projectDir, 'app'))
const hasPagesDir = fs.existsSync(path.join(projectDir, 'pages'))

let routerType = null

if (hasAppDir && !hasPagesDir) {
  routerType = 'app'
  console.log('📁 Detected: Next.js App Router (app/)')
} else if (hasPagesDir && !hasAppDir) {
  routerType = 'pages'
  console.log('📁 Detected: Next.js Pages Router (pages/)')
} else if (hasAppDir && hasPagesDir) {
  console.log('⚠️  Detected both app/ and pages/ directories')
  routerType = 'both'
} else {
  console.log('⚠️  No Next.js directories detected (app/ or pages/)')
  console.log('\n📝 Please create the Socket.io route manually:')
  console.log('   Pages Router: pages/api/socket.js')
  console.log('   App Router: app/api/socket/route.js')
  console.log('\n📖 See documentation: node_modules/easysocket/README.md\n')
  process.exit(0)
}

// Função para perguntar ao usuário
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

// Função principal assíncrona
async function setup() {
  let targetDir, targetFile, useAppRouter

  if (routerType === 'both') {
    const answer = await askQuestion('Which router do you want to use? (1) Pages Router (2) App Router [1]: ')
    useAppRouter = answer.trim() === '2'
  } else {
    useAppRouter = routerType === 'app'
  }

  if (useAppRouter) {
    targetDir = path.join(projectDir, 'app', 'api', 'socket')
    targetFile = path.join(targetDir, 'route.js')
  } else {
    targetDir = path.join(projectDir, 'pages', 'api')
    targetFile = path.join(targetDir, 'socket.js')
  }

  // Verifica se o arquivo já existe
  if (fs.existsSync(targetFile)) {
    console.log(`✅ Socket.io route already exists at ${path.relative(projectDir, targetFile)}`)
    console.log('\n✨ Setup complete! You can now use easysocket in your app.\n')
    process.exit(0)
  }

  // Pergunta se quer criar automaticamente
  const shouldCreate = await askQuestion(`\n📝 Create Socket.io route at ${path.relative(projectDir, targetFile)}? (Y/n): `)
  
  if (shouldCreate.toLowerCase() === 'n') {
    console.log('\n📖 Manual setup required. Copy the template from:')
    console.log(`   node_modules/easysocket/${useAppRouter ? 'route-app.js' : 'server.js'}`)
    console.log(`   to ${path.relative(projectDir, targetFile)}\n`)
    process.exit(0)
  }

  // Cria o diretório se não existir
  if (!fs.existsSync(targetDir)) {
    console.log(`📁 Creating ${path.relative(projectDir, targetDir)} directory...`)
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Cria o diretório se não existir
  if (!fs.existsSync(targetDir)) {
    console.log(`📁 Creating ${path.relative(projectDir, targetDir)} directory...`)
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // Conteúdo do arquivo para Pages Router
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

      // Listen to all events and broadcast to all clients
      socket.onAny((eventName, ...args) => {
        console.log(\`Event received: \${eventName}\`, args)
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
`

  // Conteúdo do arquivo para App Router
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

      // Listen to all events and broadcast to all clients
      socket.onAny((eventName, ...args) => {
        console.log(\`Event received: \${eventName}\`, args)
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
`

  const content = useAppRouter ? appRouterContent : pagesRouterContent

  // Cria o arquivo
  try {
    fs.writeFileSync(targetFile, content, 'utf8')
    console.log(`✅ Created ${path.relative(projectDir, targetFile)}`)
    console.log('\n✨ Setup complete! You can now use easysocket in your app.\n')
    console.log('📖 Quick start:')
    console.log('   import socket from "easysocket"')
    console.log('   await socket.connect()')
    console.log('   socket.emit("event", { data: "value" })')
    console.log('   socket.on("event", (payload) => console.log(payload))\n')
  } catch (error) {
    console.error('❌ Error creating socket route:', error.message)
    console.log('\n📝 Please create the route manually.')
    console.log(`   Target: ${path.relative(projectDir, targetFile)}`)
    console.log('   Template: node_modules/easysocket/README.md\n')
    process.exit(1)
  }
}

// Executa apenas se não estiver em modo CI/non-interactive
if (process.stdout.isTTY) {
  setup().catch(err => {
    console.error('Error during setup:', err)
    process.exit(1)
  })
} else {
  console.log('⚠️  Running in non-interactive mode. Skipping automatic setup.')
  console.log('📝 Please run: npx easysocket-setup')
  console.log('   Or create the route manually. See: node_modules/easysocket/README.md\n')
}