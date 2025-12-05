# EasySocket

[![npm version](https://img.shields.io/npm/v/@claudionegao/easysocket.svg)](https://www.npmjs.com/package/@claudionegao/easysocket)
[![npm downloads](https://img.shields.io/npm/dm/@claudionegao/easysocket.svg)](https://www.npmjs.com/package/@claudionegao/easysocket)
[![license](https://img.shields.io/npm/l/@claudionegao/easysocket.svg)](https://github.com/claudionegao/easysocket/blob/main/LICENSE)

Uma biblioteca simples e fácil de usar para Socket.io que abstrai a complexidade de configuração e conexão. Detecta automaticamente o endereço onde sua aplicação está rodando e suporta tanto Next.js Pages Router quanto App Router.

## Instalação

```bash
npm install @claudionegao/easysocket
```

## Configuração do Servidor (Next.js)

O easysocket detecta automaticamente se você está usando **Pages Router** ou **App Router** e oferece configuração interativa durante a instalação.

### Configuração Automática

Durante a instalação, o easysocket perguntará:
1. Qual router você está usando (se ambos `app/` e `pages/` existirem)
2. Se deseja criar automaticamente o arquivo da rota Socket.io

Se você pular a configuração automática, pode executar manualmente:

```bash
npx easysocket-setup
```

### Configuração Manual

#### Pages Router (pages/)

Crie o arquivo `pages/api/socket.js`:

```javascript
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
```

#### App Router (app/)

Crie o arquivo `app/api/socket/route.js`:

```javascript
import { Server } from 'socket.io'
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
```

### Opção Rápida: Copiar Template

```bash
# Para Pages Router
cp node_modules/easysocket/server.js pages/api/socket.js

# Para App Router
mkdir -p app/api/socket
cp node_modules/easysocket/route-app.js app/api/socket/route.js
```

## Uso

### Importar a biblioteca

```javascript
import socket from 'easysocket'
// ou
const socket = require('easysocket')
```

### Conectar ao servidor

```javascript
// Conecta automaticamente ao endereço atual da aplicação
// Usa window.location.origin automaticamente
await socket.connect()

// Ou especifique uma URL customizada (opcional)
await socket.connect('http://localhost:3000')

// Com opções adicionais do Socket.io (opcional)
await socket.connect('', {
  transports: ['websocket'],
  reconnection: true
})
```

**Nota:** A biblioteca detecta automaticamente o endereço onde sua aplicação está rodando usando `window.location.origin`, então você não precisa especificar a URL na maioria dos casos.

### Enviar eventos

```javascript
// Enviar um evento simples
socket.emit('mensagem', 'Olá, mundo!')

// Enviar com JSON
socket.emit('usuario', {
  nome: 'João',
  idade: 25,
  cidade: 'São Paulo'
})

// Enviar arrays
socket.emit('lista', ['item1', 'item2', 'item3'])
```

### Receber eventos

```javascript
// Escutar um evento
socket.on('mensagem', (payload) => {
  console.log('Mensagem recebida:', payload)
})

// Escutar evento com dados JSON
socket.on('usuario', (payload) => {
  console.log('Nome:', payload.nome)
  console.log('Idade:', payload.idade)
})

// Múltiplos listeners
socket.on('notificacao', (dados) => {
  alert(dados.mensagem)
})
```

### Remover listeners

```javascript
// Remover um listener específico
const handleMensagem = (payload) => {
  console.log(payload)
}

socket.on('mensagem', handleMensagem)
socket.off('mensagem', handleMensagem)

// Remover todos os listeners de um evento
socket.off('mensagem')
```

### Desconectar

```javascript
socket.disconnect()
```

### Verificar conexão

```javascript
if (socket.isConnected()) {
  console.log('Conectado!')
}
```

### Obter instância do Socket.io original

```javascript
const originalSocket = socket.getSocket()
```

## Exemplo Completo (React/Next.js)

```javascript
import { useEffect, useState } from 'react'
import socket from 'easysocket'

export default function Chat() {
  const [mensagens, setMensagens] = useState([])
  const [inputMensagem, setInputMensagem] = useState('')

  useEffect(() => {
    // Conecta automaticamente ao endereço atual
    socket.connect()

    // Escutar mensagens
    socket.on('chat', (payload) => {
      setMensagens(prev => [...prev, payload])
    })

    // Cleanup
    return () => {
      socket.off('chat')
    }
  }, [])

  const enviarMensagem = () => {
    socket.emit('chat', {
      texto: inputMensagem,
      timestamp: new Date().toISOString()
    })
    setInputMensagem('')
  }

  return (
    <div>
      <div>
        {mensagens.map((msg, i) => (
          <div key={i}>{msg.texto}</div>
        ))}
      </div>
      <input 
        value={inputMensagem}
        onChange={(e) => setInputMensagem(e.target.value)}
      />
      <button onClick={enviarMensagem}>Enviar</button>
    </div>
  )
}
```

## Início Rápido

1. **Instale a biblioteca:**
   ```bash
   npm install easysocket
   ```

2. **Configure o servidor Socket.io:**
   
   Durante a instalação, siga as instruções interativas, ou execute:
   ```bash
   npx easysocket-setup
   ```
   
   Ou copie manualmente:
   ```bash
   # Pages Router
   cp node_modules/easysocket/server.js pages/api/socket.js
   
   # App Router
   mkdir -p app/api/socket
   cp node_modules/easysocket/route-app.js app/api/socket/route.js
   ```

3. **Use no seu componente:**
   ```javascript
   import socket from 'easysocket'
   
   // Conectar (detecta automaticamente o endereço)
   await socket.connect()
   
   // Enviar
   socket.emit('meuEvento', { dados: 'valor' })
   
   // Receber
   socket.on('meuEvento', (payload) => {
     console.log(payload)
   })
   ```

## API

### `connect(url?, options?)`
Conecta ao servidor Socket.io.
- `url` (opcional): URL do servidor. Default: `window.location.origin`
- `options` (opcional): Opções do Socket.io
- Retorna: Promise com instância do socket

### `emit(eventName, data)`
Envia um evento para o servidor.
- `eventName`: Nome do evento
- `data`: Dados a serem enviados (string, object, array, etc.)

### `on(eventName, callback)`
Escuta um evento do servidor.
- `eventName`: Nome do evento
- `callback`: Função chamada quando o evento é recebido

### `off(eventName, callback?)`
Remove listener(s) de um evento.
- `eventName`: Nome do evento
- `callback` (opcional): Função específica para remover

### `disconnect()`
Desconecta do servidor.

### `isConnected()`
Retorna `true` se conectado.

### `getSocket()`
Retorna a instância original do Socket.io.

## Características

- ✅ **Detecção automática de URL** - Usa automaticamente o endereço onde a aplicação está rodando
- ✅ **Suporte a Pages e App Router** - Funciona com ambos os sistemas de roteamento do Next.js
- ✅ **Configuração interativa** - Instalação guiada que detecta seu tipo de projeto
- ✅ **Singleton pattern** - Uma única instância compartilhada
- ✅ **Auto-reconexão** - Reconecta automaticamente se a conexão cair
- ✅ **Fila de mensagens** - Envia automaticamente quando conectar
- ✅ **API simples e intuitiva** - Apenas `emit()` e `on()`
- ✅ **Servidor incluído** - Templates prontos para ambos os routers
- ✅ **Zero configuração** - Funciona out-of-the-box
- ✅ **TypeScript friendly** - Pronto para TypeScript
- ✅ **Suporte a SSR** - Compatível com Next.js

## Troubleshooting

### Erro: "Socket not initialized"
Certifique-se de chamar `socket.connect()` antes de usar `emit()` ou `on()`.

### Erro: "Could not initialize socket route"
Verifique se o arquivo da rota Socket.io existe:
- Pages Router: `pages/api/socket.js`
- App Router: `app/api/socket/route.js`

Execute `npx easysocket-setup` para criar o arquivo automaticamente.

### Socket não conecta
1. Verifique se o servidor Next.js está rodando
2. Verifique se o arquivo da rota foi criado no local correto
3. Abra o console do navegador para ver mensagens de erro
4. Certifique-se de que `socket.io` está instalado: `npm install socket.io`

### Instalação não interativa (CI/CD)
Em ambientes não interativos, o postinstall é ignorado. Execute manualmente:
```bash
npx easysocket-setup
```

Ou copie os templates:
```bash
# Pages Router
cp node_modules/easysocket/server.js pages/api/socket.js

# App Router  
mkdir -p app/api/socket
cp node_modules/easysocket/route-app.js app/api/socket/route.js
```

## Comandos Disponíveis

- `npx easysocket-setup` - Executa configuração interativa
- Templates disponíveis:
  - `node_modules/easysocket/server.js` - Template para Pages Router
  - `node_modules/easysocket/route-app.js` - Template para App Router

## Licença

MIT
