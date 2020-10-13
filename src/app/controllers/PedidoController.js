const LoadProdutoService = require('../services/loadProdutoService')
const LoadPedidoService = require('../services/loadPedidoService')
const Usuario = require('../models/Usuario')
const Pedido = require('../models/Pedido')

const Carrinho = require('../../lib/carrinho')
const mailer = require('../../lib/mailer')


const email = (vendedor, produto, comprador) => `
  <h2>Olá ${vendedor.nome}</h2>
  <p>Você tem um novo pedido de compra do seu produto</p>
  <p>Produto: ${produto.nome}</p>
  <p>Preço: ${produto.formatarPreco}</p>
  <p><br/><br/></p>
  <h3>Dados do comprador</h3>
  <p>${comprador.nome}</p>
  <p>${comprador.email}</p>
  <p>${comprador.endereco}</p>
  <p>${comprador.cep}</p>
  <p><br/><br/></p>
  <p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
  <p><br/><br/></p>
  <p>Atenciosamente, Equipe Hawkshop</p>
`

module.exports = {
  async index(req, res) {
    const pedidos = await LoadPedidoService.load('pedidos', {
      where: { comprador_id: req.session.usuarioId }
    })

    return res.render("pedidos/index", { pedidos })

  },
  async vendas(req, res) {
    const vendas = await LoadPedidoService.load('pedidos', {
      where: { vendedor_id: req.session.usuarioId }
    })

    return res.render("pedidos/vendas", { vendas })

  },
  async mostrar(req, res) {
    const pedido = await LoadPedidoService.load('pedido', {
      where: {id: req.params.id}
    })

    return res.render("pedidos/detalhes", { pedido })
  },
  async salvar(req, res) {

    try {

      //Pegar os produtos do carrinho
      const carrinho = Carrinho.init(req.session.carrinho)

      const comprador_id = req.session.usuarioId
      const itensFiltrados = carrinho.itens.filter(item =>
        item.produto.usuario_id != comprador_id
      )

      //Criar o pedido
      const criarPedidosPromise = itensFiltrados.map(async item => {
        let { produto, preco: total, quantidade } = item
        const { preco, id: produto_id, usuario_id: vendedor_id } = produto
        const status = "open"

        const pedido = await Pedido.criar({
          vendedor_id,
          comprador_id,
          produto_id,
          preco,
          total,
          quantidade,
          status
        })

        //Pegar os dados do produto
        produto = await LoadProdutoService.load('produto', {
          where: {
            id: produto_id
          }
        })

        //Os dados do vendedor
        const vendedor = await Usuario.buscarUm({ where: { id: vendedor_id }})

        //Os dados do comprador
        const comprador = await Usuario.buscarUm({ where: { id: comprador_id }})

        //Enviar email com dados da compra para o vendedor
        await mailer.sendMail({
          to: vendedor.email,
          from: 'no_reply@hawkshop.com.br',
          subject: 'Novo pedido de compra',
          html: email(vendedor, produto, comprador)
        })

        return pedido

      })

      await Promise.all(criarPedidosPromise)

      delete req.session.carrinho
      Carrinho.init()


      //Notificar o usuário com alguma mensagem de sucesso
      return res.render('pedidos/sucesso')



    } catch (err) {
      console.error(err)
      return res.render('pedidos/erro')
    }





  },
  async atualizar(req, res) {
    try {

      const { id, action } = req.params

      const acceptedActions = ['close', 'cancel']
      if(!acceptedActions.includes(action)) return res.send("Não achei a ação")

      //Pegar o pedido
      const pedido = await Pedido.buscarUm({
        where: { id }
      })

      if(!pedido) return res.send("Pedido não encontrado")

      //Verificar se ele está aberto
      if(pedido.status != 'open') return res.send("Não achei a ação")
      
      //Atualizar o pedido
      const statuses = {
        close: "sold",
        cancel: "canceled"

      }

      pedido.status = statuses[action]

      await Pedido.atualizar(id, {
        status: pedido.status
      })

      //Direcionar
      return res.redirect('/pedidos/vendas')

    } catch (error) {
      console.error(error)
    }
  }
}