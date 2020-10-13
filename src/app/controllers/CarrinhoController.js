const Carrinho = require('../../lib/carrinho')

const LoadProdutosService = require('../services/loadProdutoService')

module.exports = {
  async index(req, res) {

    try {

        let { carrinho } = req.session

      //gerenciador de carrinho
      carrinho = Carrinho.init(carrinho)

      return res.render("carrinho/index", { carrinho })

    } catch (err) {
      console.error(err)
    }
  },
  async adicionarUm(req, res) {
    //Pegar o id do produto e o produto
    const { id } = req.params

    const produto = await LoadProdutosService.load('produto', { where: { id }})

    //Pegar o carrinho da sessão
    let { carrinho } = req.session

    //Adicionar o produto ao carrinho (usando nosso gerenciador de carrinho)
    carrinho = Carrinho.init(carrinho).addUm(produto)

    //Atualizar o carrinho da sessão
    req.session.carrinho = carrinho

    //Redirecionar o usuário para a tela do carrinho.
    return res.redirect('/carrinho')
  
  },
  removerUm(req, res) {
    //Pegar o id do produto
    let { id } = req.params

    //Pegar o carrinho da sessão
    let { carrinho } = req.session

    //Se não tiver carrinho, retornar
    if(!carrinho) return res.redirect('/carrinho')

    //Iniciar o carrinho (gerenciador de carrinho) e remover
    carrinho = Carrinho.init(carrinho).removerUm(id)

    //Atualizar o carrinho da sessão, removendo 1 item
    req.session.carrinho = carrinho

    //Redirecionamento para a página carrinho
    return res.redirect('/carrinho')

  },
  deletar(req, res) {
    let { id } = req.params
    let { carrinho } = req.session

    if(!carrinho) return
    req.session.carrinho = Carrinho.init(carrinho).deletar(id)

    return res.redirect('/carrinho')
  }
  
}