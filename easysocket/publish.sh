#!/bin/bash

# Script de Publicação Rápida do EasySocket
# Este script automatiza o processo de publicação no npm

set -e  # Para em caso de erro

echo ""
echo "🚀 Publicação do @claudionegao/easysocket no NPM"
echo "================================================"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório easysocket/"
    exit 1
fi

# Passo 1: Verificar login
echo "📝 Passo 1: Verificando login no npm..."
if ! npm whoami &> /dev/null; then
    echo "🔐 Você não está logado. Fazendo login..."
    npm login
    echo ""
fi

USERNAME=$(npm whoami)
echo "✅ Logado como: $USERNAME"
echo ""

# Passo 2: Executar verificações
echo "🔍 Passo 2: Executando verificações..."
./check-publish.sh
echo ""

# Passo 3: Confirmar publicação
echo "⚠️  Passo 3: Confirmar publicação"
read -p "Deseja publicar @claudionegao/easysocket v1.0.0? (s/N): " CONFIRM

if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
    echo "❌ Publicação cancelada"
    exit 0
fi

# Passo 4: Publicar
echo ""
echo "📤 Passo 4: Publicando no npm..."
npm publish --access public

# Passo 5: Verificar
echo ""
echo "✅ Publicação concluída!"
echo ""
echo "🎉 Seu pacote está disponível em:"
echo "   https://www.npmjs.com/package/@claudionegao/easysocket"
echo ""
echo "📦 Agora qualquer um pode instalar com:"
echo "   npm install @claudionegao/easysocket"
echo ""
echo "📊 Veja estatísticas em:"
echo "   https://npm-stat.com/charts.html?package=@claudionegao/easysocket"
echo ""
