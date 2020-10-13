const { unlinkSync } = require('fs')
const Categoria = require('../models/Categoria')
//Vamos chamar o PRODUTO
const Produto = require('../models/Produto')
const Arquivo = require('../models/Arquivo')
const LoadProdutoService = require('../services/loadProdutoService')


module.exports = {
  async criar(req, res) {

    try {
      const categorias = await Categoria.buscarAll()
      return res.render("produtos/criar", { categorias })
    } catch (error) {
      console.error(error);
    }
  },
  async salvar(req, res) {

    try {

      let { categoria_id, nome, descricao, antigo_preco, preco, quantidade, status } = req.body

      preco = preco.replace(/\D/g, "")

      const produto_id = await Produto.criar({
        categoria_id,
        usuario_id: req.session.usuarioId,
        nome,
        descricao,
        antigo_preco: antigo_preco || preco,
        preco,
        quantidade,
        status: status || 1
      })

      const arquivosPromise = req.files.map(file =>
        Arquivo.criar({ nome: file.filename, caminho: file.path, produto_id }))

      await Promise.all(arquivosPromise)

      return res.redirect(`/produtos/${produto_id}/editar`)

    } catch (error) {
      console.error(error)
    }
    //Lógica de salvar


  },
  async mostrar(req, res) {

    try {

      const produto = await LoadProdutoService.load('produto', {
        where: {
          id: req.params.id
        }})

      return res.render("produtos/mostrar", { produto })

    } catch (error) {
      console.error(error)
    }
  },
  async editar(req, res) {

    try {

      const produto = await LoadProdutoService.load('produto', {
        where: {
          id: req.params.id
        }})

      //get categorias
      const categorias = await Categoria.buscarAll()


      return res.render("produtos/editar", { produto, categorias })

    } catch (error) {
      console.error(error)
    }
  },
  async atualizar(req, res) {

    try {

      if (req.files.length != 0) {
        const novosArquivosPromise = req.files.map(file =>
          Arquivo.criar({ ...file, produto_id: req.body.id }))

        await Promise.all(novosArquivosPromise)
      }

      if (req.body.remover_arquivos) {
        const removerArquivos = req.body.remover_arquivos.split(",")
        const ultimoIndex = removerArquivos.length - 1
        removerArquivos.splice(ultimoIndex, 1)

        const removerArquivosPromise = removerArquivos.map(id => Arquivo.deletar(id))

        await Promise.all(removerArquivosPromise)

      }



      //Formatando o preço novamente
      req.body.preco = req.body.preco.replace(/\D/g, "")
      if (req.body.antigo_preco != req.body.preco) {
        const antigoProduto = await Produto.encontrar(req.body.id)

        req.body.antigo_preco = antigoProduto.preco
      }

      await Produto.atualizar(req.body.id, {
        categoria_id: req.body.categoria_id,
        nome: req.body.nome,
        descricao: req.body.descricao,
        antigo_preco: req.body.antigo_preco,
        preco: req.body.preco,
        quantidade: req.body.quantidade,
        status: req.body.status,
      })

      return res.redirect(`/produtos/${req.body.id}`)

    } catch (error) {
      console.error(error)
    }

  },
  async deletar(req, res) {

    const arquivos = await Produto.arquivos(req.body.id)

    await Produto.deletar(req.body.id)

    arquivos.map(arquivo => {
      try {
        unlinkSync(arquivo.caminho)
      } catch (err) {
        console.error(err)
      }

    })



    return res.redirect('/produtos/criar')
  }
}
