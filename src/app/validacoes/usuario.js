const Usuario = require('../models/Usuario')
const { compare } = require('bcryptjs')

function checandoTodosCampos(body) {
  const keys = Object.keys(body)

  //Verificando se todos os CAMPOS estão PREENCHIDOS!
  for (key of keys) {
    if (body[key] == "") {
      return {
        usuario: body,
        erro: 'Por favor, preencha todos os campos.'
      }
    }
  }
}

async function mostrar(req, res, next) {
  const { usuarioId: id } = req.session

  const usuario = await Usuario.buscarUm({ where: { id } })

  if (!usuario) return res.render("usuario/registrar", {
    erro: "Usuário não encontrado!"
  })

  req.usuario = usuario

  next()
}
async function salvar(req, res, next) {

  const preencherTodosCampos = checandoTodosCampos(req.body)
  if (preencherTodosCampos) {
    return res.render("usuario/registrar", preencherTodosCampos)
  }

  //Checar se usuario existe [email, cpf_cnpj são unicos]
  let { email, cpf_cnpj, senha, senhaRepetir } = req.body

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

  const usuario = await Usuario.buscarUm({
    where: { email },
    or: { cpf_cnpj }
  })

  if (usuario) return res.render("usuario/registrar", {
    usuario: req.body,
    erro: 'Usuario já cadastrado.'
  })

  //Checar se a senha e a repetição de senha são iguais
  if (senha != senhaRepetir) return res.render("usuario/registrar", {
    usuario: req.body,
    erro: 'A senha e a repetição da senha estão incorretas.'
  })

  next()
}
async function atualizar(req, res, next) {
  const preencherTodosCampos = checandoTodosCampos(req.body)
  if (preencherTodosCampos) {
    return res.render("usuario/index", preencherTodosCampos)
  }

  const { id, senha } = req.body

  if(!senha) return res.render("usuario/index", {
    user: req.body,
    erro: "Coloque sua senha para atualizar seu cadastro."
  })

  const usuario = await Usuario.buscarUm({where: {id} })

  const passou = await compare(senha, usuario.senha)

  if(!passou) return res.render("usuario/index", {
    usuario: req.body,
    erro: "Senha incorreta."
  })

  req.usuario = usuario
  
  next()

}

module.exports = {
  salvar,
  mostrar,
  atualizar
}