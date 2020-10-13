async function salvar(req, res, next) {
  const keys = Object.keys(req.body)

  //Verificando se todos os CAMPOS estão PREENCHIDOS!
  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor, volte e preencha todos os campos.")
    }
  }

  if (!req.files || req.files.length == 0)
    return res.send('Por favor, envie pelo menos 1 imagem')

  next()
}

async function atualizar(req, res, next) {
  //Lógica de salvar
  const keys = Object.keys(req.body)

  //Verificando se todos os CAMPOS estão PREENCHIDOS!
  for (key of keys) {
    if (req.body[key] == "" && key != "remover_arquivos") {
      return res.send("Por favor preencha todos os campos!")
    }
  }

  next()
}

module.exports = {
  salvar,
  atualizar
}