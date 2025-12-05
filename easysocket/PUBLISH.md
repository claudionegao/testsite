# 🚀 Guia de Publicação no NPM

## ✅ Pré-requisitos Verificados

- [x] Nome do pacote configurado: `@claudionegao/easysocket`
- [x] Versão inicial: `1.0.0`
- [x] Arquivos incluídos: 8 arquivos (31.2 kB)
- [x] Tamanho do pacote: 7.4 kB
- [x] Documentação completa (README.md, INSTALLATION.md)

## 📝 Passos para Publicar

### 1. Fazer Login no NPM

```bash
cd /workspaces/testsite/easysocket
npm login
```

Você precisará:
- **Username** do npm
- **Password** do npm
- **Email** do npm
- **OTP** (se você tiver autenticação de dois fatores)

Se você ainda não tem conta, crie em: https://www.npmjs.com/signup

### 2. Verificar seu Login

```bash
npm whoami
```

Deve retornar seu username (ex: `claudionegao`)

### 3. (OPCIONAL) Testar o Pacote Localmente

```bash
# Criar um arquivo .tgz para teste
npm pack

# Em outro projeto, testar instalação
npm install /caminho/para/claudionegao-easysocket-1.0.0.tgz
```

### 4. Publicar o Pacote

Como o pacote usa escopo (@claudionegao), você precisa especificar acesso público:

```bash
npm publish --access public
```

### 5. Verificar Publicação

Após publicar, acesse:
- https://www.npmjs.com/package/@claudionegao/easysocket

Ou procure:
```bash
npm info @claudionegao/easysocket
```

## 🎉 Pronto! Agora qualquer um pode instalar:

```bash
npm install @claudionegao/easysocket
```

## 🔄 Atualizações Futuras

### Atualizar Versão Patch (1.0.0 → 1.0.1)
Para correções de bugs:
```bash
npm version patch
npm publish --access public
```

### Atualizar Versão Minor (1.0.0 → 1.1.0)
Para novas funcionalidades compatíveis:
```bash
npm version minor
npm publish --access public
```

### Atualizar Versão Major (1.0.0 → 2.0.0)
Para mudanças que quebram compatibilidade:
```bash
npm version major
npm publish --access public
```

## 🔧 Comandos Úteis

### Ver informações do pacote
```bash
npm info @claudionegao/easysocket
```

### Ver todas as versões publicadas
```bash
npm view @claudionegao/easysocket versions
```

### Despublicar uma versão (cuidado!)
```bash
npm unpublish @claudionegao/easysocket@1.0.0
```

### Deprecar uma versão
```bash
npm deprecate @claudionegao/easysocket@1.0.0 "Use version 1.0.1 instead"
```

## ⚠️ Notas Importantes

1. **Você só pode despublicar** nas primeiras 72 horas
2. **Não é possível republicar** a mesma versão depois de despublicar
3. **Sempre incremente a versão** antes de publicar novamente
4. **Pacotes com escopo (@)** requerem `--access public` para serem públicos

## 🌟 Após Publicar

1. Adicione badge no README:
   ```markdown
   ![npm version](https://img.shields.io/npm/v/@claudionegao/easysocket.svg)
   ![npm downloads](https://img.shields.io/npm/dm/@claudionegao/easysocket.svg)
   ```

2. Compartilhe nas redes sociais
3. Adicione no seu portfólio
4. Monitore issues no GitHub

## 📊 Estatísticas

Você pode ver estatísticas em:
- https://www.npmjs.com/package/@claudionegao/easysocket
- https://npm-stat.com/charts.html?package=@claudionegao/easysocket

## 🆘 Problemas Comuns

### "You cannot publish over the previously published versions"
- Solução: Incremente a versão com `npm version patch/minor/major`

### "You do not have permission to publish"
- Solução: Verifique se está logado com `npm whoami`

### "402 Payment Required"
- Solução: Pacotes com escopo são privados por padrão. Use `--access public`

### "403 Forbidden"
- Solução: Verifique se o nome do pacote não está reservado ou se você tem permissão

---

## 🎯 Comando Rápido (Copie e Cole)

```bash
cd /workspaces/testsite/easysocket
npm login
npm whoami
npm publish --access public
```

Boa sorte com sua publicação! 🚀
