const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 2000;

app.use(bodyParser.urlencoded({ extended: true }));

// Configurações do banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'meuBancotcc'
});

// Conexão com o banco de dados
connection.connect();

// Rota para processar a consulta
app.post('/livros', (req, res) => {

  // Consulta no banco de dados
  connection.query(`SELECT * FROM livros`, (error, results, fields) => {
    if (error) throw error;
    
    // Exibição dos resultados
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Livros</title>
        </head>
        <body>
          <h1>Livros encontrados</h1>
          <table>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Editora</th>
              <th>Quantidade</th>
            </tr>
    `;
    
    results.forEach((livro) => {
      html += `
        <tr>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.editora}</td>
          <td>${livro.qtd}</td>
        </tr>
      `;
    });
    
    html += `
          </table>
        </body>
      </html>
    `;
    
    res.send(html);
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
