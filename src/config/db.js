//Conexão com banco de dados

const { Pool } = require("pg")

module.exports = new Pool({
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
  database: "hawkshopdb"
})