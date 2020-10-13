module.exports = {
  date(timestamp) {
    const date = new Date(timestamp)

    //Vamos pegar o ANO
    const year = date.getFullYear() //UTC para PEGAR O TEMPO UNIVERSAL

    //Vamos pegar o MÊS
    //Aki os meses vão de 0 a 11
    //11 = DEZEMBRO e 0 = JANEIRO
    //O MÊS irá vir NÚMERICO
    const month = `0${date.getMonth() + 1}`.slice(-2)//SLICE = CORTAR, Cortando a STRING
    //e pegando só o que me INTERESSA NELA = .slice(-2) Estou DIZENDO PEGA OS 2 ULTIMOS DIGITOS

    //Agora vamos pegar o DIA
    const day = `0${date.getDate()}`.slice(-2)

    //Eu preciso montar ele dessa forma = return yyyy-mm-dd
    const hour = date.getHours()
    const minutes = date.getMinutes()

    //Vamos RETORNAR UM OBJETO NO FORMATO "ISO"
    return {
      day, 
      month,
      year,
      hour,
      minutes,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`
    }
  },
  formatarPreco(preco) {//Função que irá FORMATAR O PREÇO
    //Devemos FORMATAR PARA REAL = R$
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', //currency = MOEDA
      currency: 'BRL' //R$
    }).format(preco / 100) //Aqui é o VALOR que eu quero que FORMATE para mim no caso o "VALUE"
  },
  formatarCpfCnpj(value) {
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
  formatarCep(value) {
    value = value.replace(/\D/g, "")

    if (value.length > 8) {
      value = value.slice(0, -1)
    }

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
  }
}