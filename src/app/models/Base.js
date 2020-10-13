const db = require('../../config/db')

function encontrar(filters, table) {
  let query = `SELECT * FROM ${table}`


    if(filters) {
      Object.keys(filters).map(key => {
        // WHERE | OR | AND
        query += ` ${key}`
  
        Object.keys(filters[key]).map(campo => { //field
          query += ` ${campo} = '${filters[key][campo]}'`
        })
      })
    }
    
    return db.query(query)

}

const Base = {

  init({ table }) {
    if(!table) throw new Error('Parâmetros inválidos')

    this.table = table

    return this
  },
  async encontrar(id) {
    const results = await encontrar({ where: { id } }, this.table)
    return results.rows[0]
  },
  async buscarUm(filters) {
    const results = await encontrar(filters, this.table)
    return results.rows[0]
  },
  async buscarAll(filters) {
    const results = await encontrar(filters, this.table)
    return results.rows
  },
  async buscarUmDeletado(filters) {
    const results = await encontrar(filters, `${this.table}_com_deletar`)
    return results.rows[0]
  },
  async criar(campos) {
    try {
      let keys = [],
      values = []

      Object.keys(campos).map( key => {

        keys.push(key)
        values.push(`'${campos[key]}'`)

        
      })

      const query = `INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id
      `

      const results = await db.query(query)
      return results.rows[0].id
    } catch(error) {
      console.error(error);
    }
  },
  atualizar(id, campos) {
    

    try {
      let atualizar = []
      
      Object.keys(campos).map( key => {
      
        const linha = `${key} = '${campos[key]}'`
        atualizar.push(linha)

      })
  
      let query = `UPDATE ${this.table} SET
      ${atualizar.join(',')} WHERE id = ${id}
      `
  
      return db.query(query)
      
    } catch (error) {
      console.error(error);
    }

    
  },
  deletar(id) {
    return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
  },
}

module.exports = Base