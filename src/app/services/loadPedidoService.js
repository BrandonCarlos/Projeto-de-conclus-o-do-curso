const Pedido = require('../models/Pedido')
const Usuario = require('../models/Usuario')
const LoadProdutoService = require('./loadProdutoService')

const { formatarPreco, date } = require('../../lib/utils')

async function formatar(pedido) {
  //Detalhes do produto
  pedido.produto = await LoadProdutoService.load('produtoDeletado', {
    where: { id: pedido.produto_id }
  })

  //Detalhes do comprador
  pedido.comprador = await Usuario.buscarUm({
    where: { id: pedido.comprador_id }
  })

  //Detalhes do vendedor
  pedido.vendedor = await Usuario.buscarUm({
    where: { id: pedido.vendedor_id }
  })

  //Formatação do preço
  pedido.precoFormatado = formatarPreco(pedido.preco)
  pedido.totalFormatado = formatarPreco(pedido.total)

  //Formatação do status
  const statuses = {
    open: 'Aberto',
    sold: 'Vendido',
    canceled: 'Cancelado'
  }

  pedido.statusFormatado = statuses[pedido.status]
  
  //Formatação de atualizado em ...
  const atualizadoEm = date(pedido.atualizado_em)
  pedido.atualizadoEmFormatado = `${pedido.statusFormatado} em ${atualizadoEm.day}/${atualizadoEm.month}/${atualizadoEm.year} às ${atualizadoEm.hour}h${atualizadoEm.minutes}`
  
  return pedido
}

const loadService = { //Carregamento serviço
  async load(service, filter) {
    this.filter = filter
    return this[service]()
  },

  async pedido() {
    try {
      const pedido = await Pedido.buscarUm(this.filter)
      return formatar(pedido)

    } catch (error) {
      console.error(error)
    }
  },
  async pedidos() { 
    try {
      const pedidos = await Pedido.buscarAll(this.filter)

      const pedidosPromise = pedidos.map(formatar)
      return Promise.all(pedidosPromise)

    } catch (error) {
      console.error(error)
    }
  },
  formatar,
}


module.exports = loadService