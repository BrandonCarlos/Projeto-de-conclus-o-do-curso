const Usuario = require('../models/Usuario')
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
  loginForm(req, res) {
    return res.render("session/login")
  },
  login(req, res) {
    req.session.usuarioId = req.usuario.id
    return res.redirect("/usuarios")
  },
  logout(req, res) {
    req.session.destroy()
    return res.redirect("/")
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password")
  },
  async forgot(req, res) {
    const usuario = req.usuario

    try {
      //um token para esse usuario
      const token = crypto.randomBytes(20).toString("hex")

      //criar uma expiração do token
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      await Usuario.atualizar(usuario.id, {
        reset_token: token,
        reset_token_expires: now
      })

      //enviar um email com um link de recuperação de senha
      await mailer.sendMail({
        to: usuario.email,
        from: 'no-reply@hawkshop.com.br',
        subject: 'Recuperação de senha',
        html: `<h2>Perdeu a chave?</h2>
      <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
      <p>
        <a href="http://localhost:3000/usuarios/password-reset?token=${token}" target="_blank">
          RECUPERAR SENHA
        </a>
      </p>
      
      `,

      })

      //avisar o usuario que enviamos o email
      return res.render("session/forgot-password", {
        success: "Verifique seu email para resetar sua senha!"
      })
    } catch (err) {
      console.error(err)
      return res.render("session/forgot-password", {
        erro: "Erro inesperado, tente novamente!"
      })
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token })
  },
  async reset(req, res) {
    const usuario = req.usuario
    const { senha, token } = req.body

    try {


      //cria um novo hash de senha
      const novaSenha = await hash(senha, 8)

      //atualiza o usuário
      await Usuario.atualizar(usuario.id, {
        senha: novaSenha,
        reset_token: "",
        reset_token_expires: "",
      })

      //avisa o usuario que ele tem uma nova senha
      return res.render("session/login", {
        usuario: req.body,
        success: "Senha atualizada! Faça o seu login"
      })

    } catch (err) {
      console.error(err)
      return res.render("session/password-reset", {
        usuario: req.body,
        token,
        erro: "Erro inesperado, tente novamente!"
      })
    }
  }
}