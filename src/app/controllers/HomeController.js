const LoadProdutoService = require('../services/loadProdutoService')

module.exports = {
  async index(req, res) {

    try {
      const todosProdutos = await LoadProdutoService.load('produtos')
      const produtos = todosProdutos
      .filter((produto, index) => index > 2 ? false : true)
      return res.render("home/index", { produtos })
      
    } catch (err) {
      console.error(err)
    }
    
    



  }
}