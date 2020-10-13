const { formatarPreco } = require('./utils')

//Carrinho fica guardado na sessão (req.session)

const Carrinho = {
  init(antigoCarrinho) {
    if (antigoCarrinho) {
      this.itens = antigoCarrinho.itens
      this.total = antigoCarrinho.total
    } else {
      this.itens = []
      this.total = {
        quantidade: 0,
        preco: 0,
        precoFormatado: formatarPreco(0) //trocar por precoFormatado
      }
    }

    return this
  },

  addUm(produto) {
    //Ver se o produto já exite no carrinho
    let noCarrinho = this.getCarrinhoItem(produto.id)

    //Se não existe
    if (!noCarrinho) {
      noCarrinho = {
        produto: {
          ...produto,
          precoFormatado: formatarPreco(produto.preco)
        },
        quantidade: 0,
        preco: 0,
        precoFormatado: formatarPreco(0)
      }

      this.itens.push(noCarrinho)
    }

    //Excedeu a quantidade máxima
    if (noCarrinho.quantidade >= produto.quantidade) return this

    //atualizar item
    noCarrinho.quantidade++
    noCarrinho.preco = noCarrinho.produto.preco * noCarrinho.quantidade
    noCarrinho.precoFormatado = formatarPreco(noCarrinho.preco)

    //atualizar carrinho
    this.total.quantidade++
    this.total.preco += noCarrinho.produto.preco
    this.total.precoFormatado = formatarPreco(this.total.preco)

    return this

  },
  removerUm(produtoId) {
    //Pegar o item do carrinho
    const noCarrinho = this.getCarrinhoItem(produtoId)

    if (!noCarrinho) return this

    //atualizar o item
    noCarrinho.quantidade--
    noCarrinho.preco = noCarrinho.produto.preco * noCarrinho.quantidade
    noCarrinho.precoFormatado = formatarPreco(noCarrinho.preco)

    //atualizar o carrinho
    this.total.quantidade--
    this.total.preco -= noCarrinho.produto.preco
    this.total.precoFormatado = formatarPreco(this.total.preco)

    if (noCarrinho.quantidade < 1) {
      this.itens = this.itens.filter(item => item.produto.id != noCarrinho.produto.id)
      return this
    }

    return this


  },
  deletar(produtoId) {
    const noCarrinho = this.getCarrinhoItem(produtoId)
    if(!noCarrinho) return this

    if(this.itens.length > 0) {
      this.total.quantidade -= noCarrinho.quantidade
      this.total.preco -= (noCarrinho.produto.preco * noCarrinho.quantidade)
      this.total.precoFormatado = formatarPreco(this.total.preco)
    }

    this.itens = this.itens.filter(item => noCarrinho.produto.id != item.produto.id)
    return this

  },
  getCarrinhoItem(produtoId) {
    return this.itens.find(item => item.produto.id == produtoId)
  }
}

const produto = {
  id: 1,
  preco: 199,
  quantidade: 2
}

const produto2 = {
  id: 2,
  preco: 229,
  quantidade: 1
}

//Adicionar 1 item ao carrinho

//remover 1 item do carrinho

//deletar todo o item

module.exports = Carrinho
