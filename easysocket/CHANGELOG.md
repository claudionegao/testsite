# Changelog - EasySocket

## v1.2.0 - Configuração Interativa e Suporte App Router

### 🎉 Novas Funcionalidades

#### 1. Detecção Automática de Router
- ✅ Detecta se o projeto usa **Pages Router** (`pages/`)
- ✅ Detecta se o projeto usa **App Router** (`app/`)
- ✅ Pergunta ao usuário qual usar se ambos existirem
- ✅ Fornece instruções claras se nenhum for detectado

#### 2. Configuração Interativa
- ✅ Script `postinstall.js` interativo durante instalação
- ✅ Pergunta onde criar o arquivo da rota Socket.io
- ✅ Cria automaticamente o arquivo no local correto
- ✅ Verifica se arquivo já existe antes de sobrescrever

#### 3. Comando Manual de Setup
- ✅ Novo comando: `npx easysocket-setup`
- ✅ Permite reconfiguração a qualquer momento
- ✅ Opção de sobrescrever arquivos existentes
- ✅ Interface amigável com perguntas e respostas

#### 4. Suporte Completo ao App Router
- ✅ Template específico para App Router (`route-app.js`)
- ✅ Usa `NextResponse` e export de funções HTTP
- ✅ Cria em `app/api/socket/route.js`
- ✅ Documentação completa no README

#### 5. Templates Prontos
- ✅ `server.js` - Template para Pages Router
- ✅ `route-app.js` - Template para App Router
- ✅ Ambos podem ser copiados manualmente
- ✅ Código pronto para produção

#### 6. Detecção Automática de URL
- ✅ Usa `window.location.origin` automaticamente
- ✅ Funciona em qualquer endereço (localhost, produção, etc.)
- ✅ Não precisa configurar URL manualmente
- ✅ Inicializa rota `/api/socket` automaticamente

#### 7. Modo Não-Interativo (CI/CD)
- ✅ Detecta ambiente não-interativo (sem TTY)
- ✅ Não trava builds automatizados
- ✅ Fornece instruções alternativas
- ✅ Permite cópia manual de templates

### 📖 Documentação

- ✅ README.md completo com exemplos para ambos routers
- ✅ INSTALLATION.md com guia detalhado de instalação
- ✅ Exemplos de código para diferentes cenários
- ✅ Troubleshooting expandido
- ✅ Instruções para CI/CD

### 🛠️ Melhorias Técnicas

- ✅ Package.json com campo `bin` para comando CLI
- ✅ Campo `files` para incluir apenas arquivos necessários
- ✅ Scripts com permissão de execução
- ✅ Tratamento de erros robusto
- ✅ Mensagens de log claras e informativas

### 📦 Arquivos Incluídos

```
easysocket/
├── index.js           # Cliente Socket.io (singleton)
├── server.js          # Template Pages Router
├── route-app.js       # Template App Router
├── setup.js           # Script de configuração interativa
├── postinstall.js     # Script executado após npm install
├── README.md          # Documentação principal
├── INSTALLATION.md    # Guia de instalação detalhado
└── package.json       # Configuração do pacote
```

### 🚀 Como Usar

**Instalação Simples:**
```bash
npm install easysocket
# Siga as instruções interativas
```

**Reconfiguração:**
```bash
npx easysocket-setup
```

**Uso no Código:**
```javascript
import socket from 'easysocket'

await socket.connect()
socket.emit('event', { data: 'value' })
socket.on('event', (payload) => console.log(payload))
```

### 🔄 Retrocompatibilidade

- ✅ Totalmente compatível com versões anteriores
- ✅ API do cliente não mudou
- ✅ Projetos existentes continuam funcionando
- ✅ Apenas novas opções de configuração adicionadas

### 📊 Suporte

- Pages Router (Next.js 13+)
- App Router (Next.js 13+)
- Socket.io 4.6+
- Node.js 16+

---

## v1.1.0 - Detecção Automática de URL

- Detecta automaticamente endereço da aplicação
- Usa `window.location.origin`
- Inicializa rota Socket.io automaticamente

## v1.0.0 - Versão Inicial

- Cliente Socket.io simplificado
- Singleton pattern
- Fila de mensagens
- Suporte básico a Next.js Pages Router
