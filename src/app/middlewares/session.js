function soUsuarios(req, res, next) {
  if(!req.session.usuarioId) {
    return res.redirect('/usuarios/login')
  }
  
  next()
}

function logadoRedirecionarParaUsuarios(req, res, next) {
  if(req.session.usuarioId){
    return res.redirect('/usuarios')
  }

  next()
}

module.exports = {
  soUsuarios,
  logadoRedirecionarParaUsuarios
}