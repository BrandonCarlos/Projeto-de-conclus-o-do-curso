const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs')
const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')
const LoadProdutosService = require('../services/loadProdutoService')

const { formatarCep, formatarCpfCnpj } = require('../../lib/utils')

module.exports = {
  registrarForm(req, res) {

    return res.render("usuario/registrar")
  },
  async mostrar(req, res) {
    try {

      const { usuario } = req

      usuario.cpf_cnpj = formatarCpfCnpj(usuario.cpf_cnpj)
      usuario.cep = formatarCep(usuario.cep)

      return res.render('usuario/index', { usuario })
    } catch (error) {
      console.error(error)
    }
  },
  async salvar(req, res) {

    try {

      let { nome, email, senha, cpf_cnpj, cep, endereco } = req.body

      senha = await hash(senha, 8)

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      const usuarioId = await Usuario.criar({
        nome,
        email,
        senha,
        cpf_cnpj,
        cep,
        endereco
      })

      req.session.usuarioId = usuarioId

      return res.redirect('/usuarios')

    } catch (error) {
      console.error(error)
    }
  },
  async atualizar(req, res) {
    // todos os campos
    try {
      const { usuario } = req
      let { nome, email, cpf_cnpj, cep, endereco } = req.body
      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      await Usuario.atualizar(usuario.id, {
        nome,
        email,
        cpf_cnpj,
        cep,
        endereco

      })

      return res.render("usuario/index", {
        usuario: req.body,
        success: "Conta atualizada com sucesso!"
      })

    } catch (err) {
      console.error(err)
      return res.render("usuario/index", {
        erro: "Algum erro aconteceu!"
      })
    }
    // se preencheu a senha

    // se a senha são iguais
  },
  async deletar(req, res) {
    try {

      const produtos = await Produto.buscarAll({where: {usuario_id: req.body.id}})

      

      //dos produtos, pegar todas as imagens
      const todosArquivosPromise = produtos.map(produto =>
        Produto.arquivos(produto.id))

      let promiseResults = await Promise.all(todosArquivosPromise)

      //rodas a remoção do usuário
      await Usuario.deletar(req.body.id)
      req.session.destroy()

      //remover as imagens da pasta public
      promiseResults.map(arquivos => {
        arquivos.map(arquivo => {
          try {
            unlinkSync(arquivo.caminho)
          } catch (err) {
            console.error(err)
          }

        })
      })

      return res.render("session/login", {
        success: "Conta deletada com sucesso!"
      })

    } catch (err) {
      console.error(err)
      return res.render("usuario/index", {
        usuario: req.body,
        erro: "Erro ao tentar deletar sua conta!"
      })
    }
  },
  async ads(req, res) {
    const produtos = await LoadProdutosService.load('produtos', {
      where: { usuario_id: req.session.usuarioId }
    })

    return res.render("usuario/ads", { produtos })
  }
}