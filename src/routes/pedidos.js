//Inicio da CONFIGURAÇÃO DE ROTAS
const express = require('express');
const routes = express.Router()

const PedidoController = require('../app/controllers/PedidoController')

const { soUsuarios } = require('../app/middlewares/session')


routes.post('/', soUsuarios, PedidoController.salvar)
routes.get('/', soUsuarios, PedidoController.index)
routes.get('/vendas', soUsuarios, PedidoController.vendas)
routes.get('/:id', soUsuarios, PedidoController.mostrar)
routes.post('/:id/:action', soUsuarios, PedidoController.atualizar)


module.exports = routes