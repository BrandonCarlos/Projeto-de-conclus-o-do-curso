//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const produtos = require('./produtos')
const usuarios = require('./usuarios')
const carrinho = require('./carrinho')
const pedidos = require('./pedidos')




//Home
routes.get('/', HomeController.index)

routes.use('/produtos', produtos)
routes.use('/usuarios', usuarios)
routes.use('/carrinho', carrinho)
routes.use('/pedidos', pedidos)


//Atalhos
routes.get('/ads/criar', function (req, res) {
  return res.redirect("/produtos/criar")
})

routes.get('/contas', function (req, res) {
  return res.redirect("/usuarios/login")
})









module.exports = routes