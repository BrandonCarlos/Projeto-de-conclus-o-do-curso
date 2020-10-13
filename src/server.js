//Vamos importar a DEPENDÊNCIA "express" de dentro do "node-modules"
const express = require('express')

//Agora vamos chamar o routes.js
const routes = require('./routes');

//Vamos RODAR O NUNJUCKS
//ALT + SETINHA PARA CIMA para levar a linha abaixo para cima
const nunjucks = require('nunjucks');

//Agora vamos chamar o METHOD-OVERRIDE
const methodOverride = require('method-override');
const session = require('./config/session')

//o "express" de cima virou FUNÇÃO, e o "SERVER" está recebendo a função EXPRESS 
//ou seja a váriavel "SERVER" virou um SERVIDOR
const server = express();

//A linha abaixo irá fazer funcionar o BODY (req.body)
//Irá fazer aparecer na tela os DADOS que o usuario preencheu no FORMULÁRIO
//dados em formato de JSON   
//ex: {
//"avatar_url": "http://google.com"
//}
server.use(session)
server.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

server.use(express.urlencoded({ extended: true }))


//Criando uma variavel "VIDEOS"
//Importando lá do data.js os "videos"
// ./ Referencia a RAIZ DO PROJETO
//A const "videos" é o ARRAY DE VIDEOS lá do data.js

//Vamos configurar o SERVIDOR, com a ideia do EXPRESS para ele aceitar ARQUIVOS ESTÁTICOS CSS..
//Ai se tiver um arquivo .css na pasta public irá LER TRANQUILO
server.use(express.static('public'));//Agora irá aceitar ARQUIVOS ESTÁTICOS da "pasta public"

//Vamos USAR O METHOD-OVERRIDE
server.use(methodOverride('_method'))//METHOD-OVERRIDE SERVE PARA SOBREESCREVER O MÉTODO QUE EU TO USANDO
//no caso USANDO O MÉTODO (POST) e QUERO SOBREESCREVELO PARA O MÉTODO (PUT)
//1° Vou SOBREESCREVER O MÉTODO DEPOIS MANDO PRA "ROTA", ou seja SOBREESCREVO DE "POST PARA PUT e depois mando para a "ROTA"
//Ai quando chegar na ROTA já irá ser um método do tipo "PUT"
//A linha ACIMA irá LER /instructor?_method=PUT  <- EDIT.NJK

//Vamos dizer para o "server" usar o "routes"
//Assim o "server" irá ler as "rotas" que estão no arquivo "routes.js"
server.use(routes)

//Configurando a TEMPLATE ENGINE
//O MOTOR será HTML
//Vamos configurar PARA ACEITAR ARQUIVOS .NJK
server.set("view engine", "njk")

//Configurando com o NUNJUCKS
//Qual é a pasta? pasta views
//OPÇÔES no formato de OBJETO
nunjucks.configure("src/app/views", {
  //Vou usar o EXPRESS
  //Qual é a váriavel que eu to usando para o EXPRESS no caso é a váriavel "SERVER"
  express: server,
  autoescape: false,
  noCache: true
})



//Quero que o servidor esteja ligado na porta 5000
//localhost:5000
server.listen(5000, function () {
  console.log('Server is Running')
})
