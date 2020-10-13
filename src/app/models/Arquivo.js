const Base = require('./Base')

Base.init({ table: 'arquivos' })


module.exports = {

  ...Base,
}

/*
async deletar(id) {

  try {
    const result = await db.query(`SELECT * FROM arquivos WHERE id = $1`, [id])
    const arquivo = result.rows[0]
    fs.unlinkSync(arquivo.caminho)

    return db.query(`
      DELETE FROM arquivos WHERE id = $1 
    `, [id])

  } catch (err) {
    console.error(err)
  }

}
*/

