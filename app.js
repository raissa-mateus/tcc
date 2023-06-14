const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "meuBancotcc"
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/perfiladm1.html");
});
 // cadastro clientes
app.get("/cadLivro", (req, res) => {
  res.sendFile(__dirname + "/cadastrolivro.html");
});

app.post("/cadLivro", (req, res) => {
  const  { titulo, autor, editora, genero, idioma, classificacao } = req.body;
  if (!titulo || !autor || !editora || !genero || !idioma || !classificacao) {
    res.status(400).send("Todos os campos são obrigatórios.");
    return;
  }

  const livro = { titulo, autor, editora, genero, idioma, classificacao };
  connection.query("INSERT INTO livros SET ?", livro, (err, result) => {
    if (err) throw err;
    console.log(`Livro ${titulo} cadastrado com sucesso!`);
    res.redirect("/");
  });
});

// Rota para processar a listagem
app.get('/listagemlivros', (req, res) => {

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
              <th>Titulo</th>
              <th>Autor</th>
              <th>Editora</th>
            </tr>
    `;
    
    results.forEach((livro) => {
      html += `
        <tr>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.editora}</td>
        </tr>
      `;
    });
    
    html += `
          </table>
          <a href="/">Voltar</a>
        </body>
      </html>
    `;
    
    res.send(html);
  });
});

// Rota para exibir o formulário de consulta
app.get('/consultalivro', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Consulta de Livro</title>
      </head>
      <body>
        <h1>Consulta de Livro</h1>
        <form method="POST" action="/consultalivro">
          <label for="titulo">Titulo:</label>
          <input type="text" id="titulo" name="titulo"><br><br>
          <button type="submit">Consultar</button>
        </form>
      </body>
    </html>
  `);
});

// Rota para processar a consulta
app.post('/consultalivro', (req, res) => {
  //const titulo = req.body.titulo;
  const { titulo, autor } = req.body;
  //const autor = req.body.autor;
  
  // Consulta no banco de dados
  connection.query(`SELECT * FROM livros WHERE titulo LIKE '%${titulo}%'`, (error, results, fields) => {
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
            </tr>
    `;
    
    results.forEach((livro) => {
      html += `
        <tr>
          <td>${livro.titulo}</td>
          <td>${livro.autor}</td>
          <td>${livro.editora}</td>
        </tr>
      `;
    });
    
    html += `
          </table>
          <a href="/">Voltar</a>
        </body>
      </html>
    `;
    
    res.send(html);
  });
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao banco de dados MySQL!");
});

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
