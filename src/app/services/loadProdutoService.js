const Produto = require('../models/Produto')

const { formatarPreco, date } = require('../../lib/utils')

async function getImages(produtoId) {
  let arquivos = await Produto.arquivos(produtoId)
  arquivos = arquivos.map(file => ({
    ...file,
    src: `${file.caminho.replace("public", "")}`
  }))

  return arquivos
}

async function formatar(produto) {
  const arquivos = await getImages(produto.id)
  produto.img = arquivos[0].src
  produto.arquivos = arquivos
  produto.formatarAntigoPreco = formatarPreco(produto.antigo_preco)
  produto.formatarPreco = formatarPreco(produto.preco)

  const { day, hour, minutes, month } = date(produto.atualizado_em)

  produto.publicar = {
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}`,
  }

  return produto
}

const loadService = { //Carregamento serviço
  async load(service, filter) {
    this.filter = filter
    return this[service]()
  },

  async produto() {
    try {
      const produto = await Produto.buscarUm(this.filter)
      return formatar(produto)

    } catch (error) {
      console.error(error)
    }
  },
  async produtos() { 
    try {
      
      const produtos = await Produto.buscarAll(this.filter)
      const produtosPromise = produtos.map(formatar)
      return Promise.all(produtosPromise)

    } catch (error) {
      console.error(error)
    }
  },
  async produtoDeletado() {
    try {
      let produto = await Produto.buscarUmDeletado(this.filter)
      return formatar(produto)
    } catch (error) {
      console.error(error)
    }
  },
  formatar,
}


module.exports = loadService