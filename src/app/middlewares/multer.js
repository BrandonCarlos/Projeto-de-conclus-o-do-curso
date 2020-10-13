const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/imagens')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const aceito = ['image/png', 'image/jpg', 'image/jpeg']
  .find(formatoAceito => formatoAceito == file.mimetype)

  if(aceito) {
    return cb(null, true);  
  }

  return cb(null, false)
}

module.exports = multer({
  storage,
  fileFilter
})