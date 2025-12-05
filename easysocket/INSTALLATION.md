# EasySocket - Guia de Instalação Interativa

## Durante a instalação do npm

Quando você executa `npm install easysocket`, o script de instalação:

1. **Detecta automaticamente** seu tipo de projeto Next.js:
   - 📁 Pages Router (`pages/` directory)
   - 📁 App Router (`app/` directory)
   - ⚠️ Ambos (pergunta qual usar)
   - ⚠️ Nenhum (instruções manuais)

2. **Pergunta interativamente**:
   - "Qual router você deseja usar?" (se ambos existirem)
   - "Deseja criar o arquivo da rota automaticamente?" (Y/n)

3. **Cria automaticamente** o arquivo correto:
   - Pages Router → `pages/api/socket.js`
   - App Router → `app/api/socket/route.js`

## Configuração Manual

Se você pular a configuração automática ou quiser reconfigurar:

```bash
npx easysocket-setup
```

Este comando interativo:
- Pergunta qual router você está usando
- Verifica se o arquivo já existe
- Permite sobrescrever se necessário
- Cria o arquivo no local correto

## Opções de Configuração

### 1. Instalação Automática (Recomendado)
```bash
npm install easysocket
# Siga as instruções interativas
```

### 2. Setup Manual Interativo
```bash
npm install easysocket
npx easysocket-setup
```

### 3. Cópia Manual de Template
```bash
npm install easysocket

# Para Pages Router
cp node_modules/easysocket/server.js pages/api/socket.js

# Para App Router
mkdir -p app/api/socket
cp node_modules/easysocket/route-app.js app/api/socket/route.js
```

### 4. Criação Manual Completa
Copie o código do README.md para o arquivo apropriado.

## Ambientes CI/CD (Não Interativos)

Em ambientes sem terminal interativo (CI/CD, Docker build, etc.):

```dockerfile
# No Dockerfile ou script de build
RUN npm install easysocket
RUN cp node_modules/easysocket/server.js pages/api/socket.js
```

Ou adicione ao `package.json`:

```json
{
  "scripts": {
    "postinstall": "cp node_modules/easysocket/server.js pages/api/socket.js || true"
  }
}
```

## Personalização

Você pode editar o arquivo criado para:
- Adicionar autenticação
- Modificar CORS
- Adicionar lógica customizada de eventos
- Integrar com banco de dados
- Adicionar rate limiting

## Estrutura de Arquivos

```
seu-projeto/
├── pages/                    # Pages Router
│   └── api/
│       └── socket.js        # Rota Socket.io
│
ou
│
├── app/                      # App Router
│   └── api/
│       └── socket/
│           └── route.js     # Rota Socket.io
│
└── node_modules/
    └── easysocket/
        ├── index.js         # Cliente Socket.io
        ├── server.js        # Template Pages Router
        ├── route-app.js     # Template App Router
        ├── setup.js         # Script de configuração
        └── postinstall.js   # Script de instalação
```

## Verificação

Para verificar se está funcionando:

1. Inicie o servidor Next.js: `npm run dev`
2. Abra o console do navegador
3. Veja as mensagens de inicialização do Socket.io

Deve aparecer:
```
Initializing Socket.io server...
Socket.io server initialized successfully
```
