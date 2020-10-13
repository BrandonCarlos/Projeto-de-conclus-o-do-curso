const faker = require('faker')

const { hash } = require('bcryptjs')

const Usuario = require('./src/app/models/Usuario')
const Produto = require('./src/app/models/Produto')
const Arquivo = require('./src/app/models/Arquivo')

let usuariosIds = []
let totalProdutos = 10
let totalUsuarios = 3

async function criarUsuarios() {
  const usuarios = []
  const senha = await hash('1111', 8)

  while(usuarios.length < totalUsuarios) {
    usuarios.push({
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha,
      cpf_cnpj: faker.random.number(99999999),
      cep: faker.random.number(9999999999),
      endereco: faker.address.streetName(),
    })
  }

  const usuariosPromise = usuarios.map(usuario => Usuario.criar(usuario))

  usuariosIds = await Promise.all(usuariosPromise)
}

async function criarProdutos() {
  let produtos = []

  while(produtos.length < totalProdutos) {
    produtos.push({
      categoria_id: Math.ceil(Math.random() * 3),
      usuario_id: usuariosIds[Math.floor(Math.random() * totalUsuarios)],
      nome: faker.name.title(),
      descricao: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
      antigo_preco: faker.random.number(9999),
      preco: faker.random.number(9999),
      quantidade: faker.random.number(99),
      status: Math.round(Math.random())
    })
  }

  const produtosPromise = produtos.map(produto => Produto.criar(produto))
  produtosIds = await Promise.all(produtosPromise)

  let arquivos = []

  while(arquivos.length < 50) {
    arquivos.push({
      nome: faker.image.image(),
      caminho: `public/imagens/placeholder.png`,
      produto_id: produtosIds[Math.floor(Math.random() * totalProdutos)]

    })
  }

  const arquivosPromise = arquivos.map(arquivo => Arquivo.criar(arquivo))

  await Promise.all(arquivosPromise)

}

async function init() {
  await criarUsuarios()
  await criarProdutos()
}

init()