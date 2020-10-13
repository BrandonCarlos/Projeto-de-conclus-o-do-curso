const Mascara = {
  aplicar(input, func) {
    setTimeout(function () {
      input.value = Mascara[func](input.value)
    }, 1)
  },
  formatarBRL(value) {
    value = value.replace(/\D/g, "") //D = somente números,  g = global, o usuário só podera digitar NÚMEROS

    //Devemos FORMATAR PARA REAL = R$
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', //currency = MOEDA
      currency: 'BRL' //R$
    }).format(value / 100) //Aqui é o VALOR que eu quero que FORMATE para mim no caso o "VALUE"

    //Fazendo (/100) pois -> 180,23 -> como digitamos = 18023 / 100 == 180.23

    //e.target.value = value //Só que ainda está permitindo uma LETRA, e quando digitamos outra letra, e substituida,
    //então devemos usar o "setTimeout" para fazer com que o USUÁRIO não consiga digitar LETRAS apenas NÚMEROS 
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g, "")

    if (value.length > 14) {
      value = value.slice(0, -1)
    }

    // Checar se é CNPJ
    if(value.length > 11) {
      //11222333444455

      //11.222333444455
      value = value.replace(/(\d{2})(\d)/, "$1.$2")
      
      //11.222.333444455
      value = value.replace(/(\d{3})(\d)/, "$1.$2")    
      
      //11.222.333/444455
      value = value.replace(/(\d{3})(\d)/, "$1/$2")
      
      //11.222.333/4444-55
      value = value.replace(/(\d{4})(\d)/, "$1-$2")


    } else {
      //cpf
      value = value.replace(/(\d{3})(\d)/, "$1.$2")

      value = value.replace(/(\d{3})(\d)/, "$1.$2")

      value = value.replace(/(\d{3})(\d)/, "$1-$2")
    }

    return value

  },
  cep(value) {
    value = value.replace(/\D/g, "")

    if (value.length > 8) {
      value = value.slice(0, -1)
    }

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
  }
}

const Fotos = {
  input: "",
  preview: document.querySelector('#fotos-preview'),
  limiteUpload: 6,
  files: [],
  UploadFotos(event) {
    const { files: fileList } = event.target
    Fotos.input = event.target

    if(Fotos.limite(event)) return

    Array.from(fileList).forEach(file => {

      Fotos.files.push(file)

      const lerArquivo = new FileReader()

      lerArquivo.onload = () => {
        const imagem = new Image()
        imagem.src = String(lerArquivo.result)

        const div = Fotos.getContainer(imagem)

        Fotos.preview.appendChild(div)

      }

      lerArquivo.readAsDataURL(file)

    })

    Fotos.input.files = Fotos.getAllArquivos()
  },

  limite(event) {
    const { limiteUpload, input, preview } = Fotos
    const { files: fileList } = input

    if (fileList.length > limiteUpload) {
      alert(`Envie no máximo ${limiteUpload} fotos`)
      event.preventDefault()
      return true
    }

    const fotosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "foto")
        fotosDiv.push(item)
    })

    const totalFotos = fileList.length + fotosDiv.length
    if (totalFotos > limiteUpload) {
      alert("Você atingiu o limite máximo de fotos")
      event.preventDefault()
      return true
    }

    return false
  },
  getAllArquivos() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
    
    Fotos.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(imagem) { //criarDiv()
    const div = document.createElement('div')
    div.classList.add('foto')

    div.onclick = Fotos.removerFoto

    div.appendChild(imagem)

    div.appendChild(Fotos.getBotaoRemover())

    return div
  },

  getBotaoRemover() {
    const botao = document.createElement('i')
    botao.classList.add('material-icons')
    botao.innerHTML = "close"
    return botao
  },

  removerFoto(event) {
    const FotoDiv = event.target.parentNode // <div class="foto">
    const fotosArray = Array.from(Fotos.preview.children)
    const index = fotosArray.indexOf(FotoDiv)

    Fotos.files.splice(index, 1)
    Fotos.input.files = Fotos.getAllArquivos()

    FotoDiv.remove()
  },

  removerAntigaFoto(event) {
    const fotoDiv = event.target.parentNode

    if (fotoDiv.id) {
      const removerArquivos = document.querySelector('input[name="remover_arquivos"]')
      if (removerArquivos) {
        removerArquivos.value += `${fotoDiv.id},` // 
      }
    }

    fotoDiv.remove()
  }


}

const ImagemGaleria = {
  destaque: document.querySelector('.galeria .destaque > img'),
  previews: document.querySelectorAll('.galeria-preview img'),
  setImagem(e) {
    const { target } = e


    ImagemGaleria.previews.forEach(preview => preview.classList.remove("ativado"))

    target.classList.add("ativado")
    ImagemGaleria.destaque.src = target.src

    Box.imagem.src = target.src
  
  }
}

const Box = {
  target: document.querySelector('.box-target'),
  imagem: document.querySelector('.box-target img'),
  botaoFechar: document.querySelector('.box-target a.box-fechar'),
  abrir() {
    Box.target.style.opacity = 1
    Box.target.style.top = 0
    Box.target.style.bottom = 0
    Box.botaoFechar.style.top = 0

  },

  fechar() {
    Box.target.style.opacity = 0
    Box.target.style.top = "-100%"
    Box.target.style.bottom = "initial"
    Box.botaoFechar.style.top = "-80px"
  }
}


const Validar = {
  aplicar(input, func) {

    Validar.limparErros(input)
      let results = Validar[func](input.value)
      input.value = results.value

      if(results.erro) {
        Validar.displayErro(input, results.erro)
      }


  },
  displayErro(input, erro) {
    const div = document.createElement('div')
    div.classList.add('erro')
    div.innerHTML = erro
    input.parentNode.appendChild(div)
    
    input.focus()
  },
  limparErros(input) {
    const erroDiv = input.parentNode.querySelector(".erro") 
    if (erroDiv) {
      erroDiv.remove()
    }
  },
  Email(value) {
    let erro = null
    const formatarEmail = /^\w+(\.-]?\w+)*@\w+(\.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(formatarEmail)){
      erro = "Email Inválido"
    }

    return {
      erro,
      value
    }
  },
  VerificarCpfCnpj(value) {
    let erro = null

    const limparValores = value.replace(/\D/g, "")

    if (limparValores.length > 11 && limparValores.length !== 14) {
      erro = "CNPJ incorreto"
    } else if (limparValores.length < 12 && limparValores.length !== 11) {
      erro = "CPF incorreto"
    }

    return {
      erro,
      value
    }
  },
  VerificarCep(value) {
    let erro = null

    const limparValores = value.replace(/\D/g, "")

    if (limparValores.length !== 8) {
      erro = "CEP incorreto"
    }

    return {
      erro,
      value
    }
  },
  todosCampos(e) {
    const itens = document.querySelectorAll(' .item input, .item select, .item textarea')

    for(item of itens) {
      if(item.value == "") {
        const mensagem = document.createElement('div')
        mensagem.classList.add('mensagens')//Reaproveitando a mensagem que está no arquivo mensagens.njk
        mensagem.classList.add('erro')
        mensagem.style.position = 'fixed'
        mensagem.innerHTML = 'Todos os campos são obrigatórios.'
        document.querySelector('body').append(mensagem)

        e.preventDefault()
      }
    }
  }
}
