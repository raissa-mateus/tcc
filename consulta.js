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

// Rota para exibir o formulário de consulta
app.get('/consulta', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Consulta de Livros</title>
      </head>
      <body>
        <h1>Consulta de livros</h1>
        <form method="POST" action="/livros">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" name="titulo"><br><br>

          <label for="autor">Autor:</label>
          <input type="text" id="autor" name="autor"><br><br>

          <label for="editora">Editora:</label>
          <input type="text" id="editora" name="editora"><br><br>
          
          <button type="submit">Consultar</button>
        </form>
      </body>
    </html>
  `);
});

// Rota para processar a consulta
app.post('/livros', (req, res) => {
  //const titulo = req.body.titulo;
  const { titulo, autor, editora } = req.body;
  //const autor = req.body.autor;
  //const editora = req.body.editora
  
  // Consulta no banco de dados
  connection.query(`SELECT * FROM livros WHERE titulo LIKE '%${titulo}%'`, (error, results, fields) => {
    if (error) throw error;

    // consulta por autor
    connection.query(`SELECT * FROM livros WHERE autor LIKE '%${autor}%'`, (error, results, fields) => {
      if (error) throw error;
    
    // consulta por editora
    connection.query(`SELECT * FROM livros WHERE editora LIKE '%${editora}%'`, (error, results, fields) => {
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
              <th>Titulo</th>
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
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
