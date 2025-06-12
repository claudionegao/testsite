const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Site Básico Node.js</title>
</head>
<body>
    <h1>Bem-vindo ao meu site básico em Node.js!</h1>
    <p>Este é um exemplo simples de servidor HTTP.</p>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
});

server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});