const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'produtos' })


module.exports = {

  ...Base,
  async arquivos(id) {
    const results = await db.query(`
      SELECT * FROM arquivos WHERE produto_id = $1
    `, [id])

    return results.rows
  },
  async buscando({ filter, categoria }) { //ERRO tive que mudar para "buscando" pois estava "buscar" que é a mesma de acima

    let query = `
    SELECT produtos.*,
    categorias.nome AS categoria_nome
    FROM produtos
    LEFT JOIN categorias ON (categorias.id = produtos.categoria_id)
    WHERE 1 = 1
    `

    if (categoria) {
      query += ` AND produtos.categoria_id = ${categoria}`
    }

    if (filter) {
      query += ` AND (produtos.nome ilike '%${filter}%'
      OR produtos.descricao ilike '%${filter}%')`
    }

    query += `AND status != 0`


    const results = await db.query(query)
    return results.rows
  }
}
