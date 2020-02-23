// Configuração do servidor usuando o Express 
const express = require("express");
const server = express();

//Configuração do servidor para apresentação de aquivos estáticos
server.use(express.static('public')); 

// Habilitação do body do formulario
server.use(express.urlencoded({extended: true}));

// Configuração do Bando de Dados
const Pool = require('pg').Pool; // Linha para manter a conexão com o banco ativa
const db = new Pool({
    user: 'postgres', 
    password: 'Salmos917@@',
    host: 'localhost', // Endereço do bando de dados
    port: 5432, // Porta de acesso
    database: 'doe' // Nome do banco de dados
}); 

//Configurção da template Engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// Configurar a apresentação da página
server.get("/", function(req, res) {
    db.query("select * from donors", function(err, result) {
        if (err) {
            return res.send("Erro de bando de dados!");
        }

        const donors = result.rows;

        return res.render("index.html", { donors });
    });
});

server.post("/", function(req, res) {
    //Selecionar e trazer os dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios") 
    }

    // Colocar os valor dentro do banco de dados 
    const query = `
    INSERT INTO donors("name", "email", "blood") 
    VALUES($1, $2, $3)`

    const values = [name, email, blood];
    
    db.query(query, values, function(err){
        if (err) return res.send("Erro no Banco de Dados");

        // Fluxo de continuação do processo
        return res.redirect("/");
    });
})

// Inicialização do servidor na minha máquina 
server.listen(3000, function(){
    console.log("Servidor Inicializado com Sucesso!")
})

// http://127.0.0.1:3000/ Endereço local da aplicação 