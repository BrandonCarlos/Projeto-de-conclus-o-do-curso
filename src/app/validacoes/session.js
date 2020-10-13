const Usuario = require('../models/Usuario')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
  const { email, senha } = req.body

  const usuario = await Usuario.buscarUm({ where: { email } })

  if (!usuario) return res.render("session/login", {
    usuario: req.body,
    erro: "Usuário não cadastrado!"
  })

  const passou = await compare(senha, usuario.senha)

  if (!passou) return res.render("session/login", {
    usuario: req.body,
    erro: "Senha incorreta."
  })

  req.usuario = usuario

  next()
}

async function forgot(req, res, next) {
  const { email } = req.body

  try {
    let usuario = await Usuario.buscarUm({ where: { email } })

    if (!usuario) return res.render("session/forgot-password", {
      usuario: req.body,
      erro: "Email não cadastrado!"
    })

    req.usuario = usuario

    next()

  } catch (err) {
    console.error(err)
  }


}

async function reset(req, res, next) {
  // primeiro procurar o usuário
  const { email, senha, token, senhaRepetir } = req.body

  const usuario = await Usuario.buscarUm({ where: { email } })

  if (!usuario) return res.render("session/password-reset", {
    usuario: req.body,
    token,
    erro: "Usuário não cadastrado!"
  })

  //ver se a senha é igual
  if (senha != senhaRepetir) return res.render("session/password-reset", {
    usuario: req.body,
    token,
    erro: 'A senha e a repetição da senha estão incorretas.'
  })

  //verificar se o token é igual
  if(token != usuario.reset_token) return res.render("session/password-reset", {
    usuario: req.body,
    token,
    erro: 'Token inválido! Solicite uma nova recuperação de senha.'
  })

  //verificar se o token não expirou
  let now = new Date()
  now = now.setHours(now.getHours())

  if(now > usuario.reset_token_expires) return res.render("session/password-reset", {
    usuario: req.body,
    token,
    erro: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
  })

  req.usuario = usuario
  next()

}


module.exports = {
  login,
  forgot,
  reset
}