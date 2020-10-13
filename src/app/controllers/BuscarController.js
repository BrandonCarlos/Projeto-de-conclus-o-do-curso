const Produto = require('../models/Produto')
const LoadProdutosService = require('../services/loadProdutoService')

module.exports = {
  async index(req, res) {

    try {
        
      let { filter, categoria } = req.query

      if( !filter || filter.toLowerCase() == 'toda a loja') filter = null


      let produtos = await Produto.buscando({ filter, categoria })

      const produtosPromise = produtos.map(LoadProdutosService.formatar)

      produtos = await Promise.all(produtosPromise)

      const buscar = {
        term: filter || 'Toda a loja',
        total: produtos.length
      }

      const categorias = produtos.map(produto => ({
        id: produto.categoria_id,
        nome: produto.categoria_nome
      })).reduce((categoriasFiltrado, categoria) => {

        const encontrar = categoriasFiltrado.some(cat => cat.id == categoria.id)

        if(!encontrar) 
        categoriasFiltrado.push(categoria)

        return categoriasFiltrado
      }, [])

      return res.render("buscar/index", { produtos, buscar, categorias })

    }
    catch (err) {
      console.error(err)
    }
  }
}