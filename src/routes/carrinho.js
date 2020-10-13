//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()

const CarrinhoController = require('../app/controllers/CarrinhoController')

routes.get('/', CarrinhoController.index)
routes.post('/:id/adicionar-um', CarrinhoController.adicionarUm)
routes.post('/:id/remover-um', CarrinhoController.removerUm)
routes.post('/:id/deletar', CarrinhoController.deletar)


module.exports = routes