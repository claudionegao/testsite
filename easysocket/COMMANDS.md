# 📋 COMANDOS PRONTOS - COPIE E COLE

## 🚀 PUBLICAÇÃO COMPLETA (3 comandos)

```bash
cd /workspaces/testsite/easysocket
npm login
npm publish --access public
```

---

## 🔍 VERIFICAR ANTES DE PUBLICAR

```bash
cd /workspaces/testsite/easysocket
./check-publish.sh
```

---

## 🤖 PUBLICAÇÃO AUTOMÁTICA

```bash
cd /workspaces/testsite/easysocket
./publish.sh
```

---

## ✅ VERIFICAR APÓS PUBLICAR

```bash
npm view @claudionegao/easysocket
```

---

## 📊 VER INFORMAÇÕES DO PACOTE

```bash
npm info @claudionegao/easysocket
npm info @claudionegao/easysocket versions
npm info @claudionegao/easysocket dist-tags
```

---

## 🔄 ATUALIZAR VERSÃO

```bash
# Bug fix (1.0.0 → 1.0.1)
npm version patch
npm publish --access public

# Nova feature (1.0.0 → 1.1.0)
npm version minor
npm publish --access public

# Breaking change (1.0.0 → 2.0.0)
npm version major
npm publish --access public
```

---

## 🧪 TESTAR LOCALMENTE

```bash
# Criar pacote para teste
npm pack

# Em outro projeto
npm install /workspaces/testsite/easysocket/claudionegao-easysocket-1.0.0.tgz
```

---

## 🗑️ DESPUBLICAR (Cuidado!)

```bash
# Apenas nas primeiras 72 horas
npm unpublish @claudionegao/easysocket@1.0.0

# Despublicar todas as versões (irreversível!)
npm unpublish @claudionegao/easysocket --force
```

---

## ⚠️ DEPRECAR VERSÃO

```bash
npm deprecate @claudionegao/easysocket@1.0.0 "Use versão 1.0.1 ou superior"
```

---

## 👤 VERIFICAR LOGIN

```bash
npm whoami
```

---

## 🔐 FAZER LOGOUT

```bash
npm logout
```

---

## 📦 INSTALAR SEU PRÓPRIO PACOTE

```bash
npm install @claudionegao/easysocket
```

---

## 🌐 ABRIR NO NAVEGADOR

```bash
# Linux/Mac
xdg-open https://www.npmjs.com/package/@claudionegao/easysocket

# Ou manualmente acesse:
# https://www.npmjs.com/package/@claudionegao/easysocket
```

---

## 🎯 PASSO A PASSO COMPLETO

```bash
# 1. Ir para o diretório
cd /workspaces/testsite/easysocket

# 2. Fazer login (primeira vez)
npm login

# 3. Verificar que está logado
npm whoami

# 4. Verificar o pacote
./check-publish.sh

# 5. Publicar
npm publish --access public

# 6. Verificar publicação
npm view @claudionegao/easysocket

# 7. Testar instalação
npm install @claudionegao/easysocket
```

---

## 🎉 PRONTO!

Copie e cole os comandos acima conforme necessário.

Para ajuda completa, veja:
- QUICK-START-PUBLISH.md
- PUBLISH.md
