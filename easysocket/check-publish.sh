#!/bin/bash

echo "🔍 Verificação Pré-Publicação do EasySocket"
echo "==========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado${NC}"
    echo "Execute este script no diretório easysocket/"
    exit 1
fi

echo -e "${YELLOW}📦 Informações do Pacote${NC}"
echo "Nome: $(node -p "require('./package.json').name")"
echo "Versão: $(node -p "require('./package.json').version")"
echo "Descrição: $(node -p "require('./package.json').description")"
echo ""

# Verificar login no npm
echo -e "${YELLOW}👤 Verificando login no npm...${NC}"
if npm whoami &> /dev/null; then
    USERNAME=$(npm whoami)
    echo -e "${GREEN}✅ Logado como: $USERNAME${NC}"
else
    echo -e "${RED}❌ Você não está logado no npm${NC}"
    echo "Execute: npm login"
    exit 1
fi
echo ""

# Verificar se o nome está disponível
echo -e "${YELLOW}🔍 Verificando disponibilidade do nome...${NC}"
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view "$PACKAGE_NAME" version &> /dev/null; then
    CURRENT_VERSION=$(npm view "$PACKAGE_NAME" version)
    echo -e "${YELLOW}⚠️  Pacote já existe (versão atual: $CURRENT_VERSION)${NC}"
    echo "Certifique-se de que a versão no package.json é maior"
else
    echo -e "${GREEN}✅ Nome disponível para publicação${NC}"
fi
echo ""

# Verificar arquivos que serão incluídos
echo -e "${YELLOW}📄 Arquivos que serão incluídos:${NC}"
npm pack --dry-run 2>&1 | grep -A 50 "Tarball Contents"
echo ""

# Verificar tamanho
echo -e "${YELLOW}📊 Tamanho do pacote:${NC}"
npm pack --dry-run 2>&1 | grep "package size"
npm pack --dry-run 2>&1 | grep "unpacked size"
echo ""

# Verificar dependências
echo -e "${YELLOW}📚 Dependências:${NC}"
echo "Dependencies: $(node -p "Object.keys(require('./package.json').dependencies || {}).join(', ') || 'Nenhuma'")"
echo "PeerDependencies: $(node -p "Object.keys(require('./package.json').peerDependencies || {}).join(', ') || 'Nenhuma'")"
echo ""

# Verificar se tem README
echo -e "${YELLOW}📖 Verificando documentação...${NC}"
if [ -f "README.md" ]; then
    echo -e "${GREEN}✅ README.md presente${NC}"
    README_SIZE=$(wc -l < README.md)
    echo "   Linhas: $README_SIZE"
else
    echo -e "${RED}❌ README.md não encontrado${NC}"
fi

if [ -f "LICENSE" ]; then
    echo -e "${GREEN}✅ LICENSE presente${NC}"
else
    echo -e "${YELLOW}⚠️  LICENSE não encontrado (recomendado)${NC}"
fi
echo ""

# Verificar scripts
echo -e "${YELLOW}🔧 Scripts disponíveis:${NC}"
node -p "Object.keys(require('./package.json').scripts || {}).map(s => '  - ' + s).join('\\n') || '  Nenhum'"
echo ""

# Teste de instalação local
echo -e "${YELLOW}🧪 Testando empacotamento...${NC}"
if npm pack &> /dev/null; then
    TARBALL=$(ls -t *.tgz | head -1)
    echo -e "${GREEN}✅ Pacote criado: $TARBALL${NC}"
    
    # Limpar
    rm -f *.tgz
else
    echo -e "${RED}❌ Erro ao empacotar${NC}"
    exit 1
fi
echo ""

echo "==========================================="
echo -e "${GREEN}✅ Verificação concluída!${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos passos:${NC}"
echo ""
echo "1. Revisar as informações acima"
echo "2. Se tudo estiver correto, execute:"
echo ""
echo -e "   ${GREEN}npm publish --access public${NC}"
echo ""
echo "3. Após publicar, verifique em:"
echo "   https://www.npmjs.com/package/$PACKAGE_NAME"
echo ""
