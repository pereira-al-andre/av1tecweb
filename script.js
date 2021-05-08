// Carrega os produtos na listagem
function carregaProdutos(lista) {

    let listagem = ''
    let lista_de_produtos = $('#lista_de_produtos')

    let moeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

    lista.forEach(item => {
        
        listagem += `
            <ul class="lista flex-row space">
                <li> <img src='${item.imagem}'> </li>
                <li>${item.nome}</li>
                <li>${moeda.format( item.preco)}</li>
                <li class='quantidade'>0</li>
                <li class="flex-row space">
                    <button class="btn_info add material-icons">add</button>
                    <button class="btn_danger remove material-icons">remove</button>
                </li>
            </ul>
        `
    });

    lista_de_produtos.html(listagem)
}

// Lista de produtos json
const lista = [
    {
        nome: 'Coca cola 2l',
        preco: 7.99,
        imagem: './img/cocacola.webp'
    },
    {
        nome: 'Lata de sardinha',
        preco: 2.20,
        imagem: './img/sardinha.jpg'
    },
    {
        nome: 'Batata doce Kg',
        preco: 3,
        imagem: './img/batatadoce.jpeg'
    },
    {
        nome: 'Lata de milho',
        preco: 1.5,
        imagem: './img/milho.png'
    },
]

// Função do carrinho
const Carrinho = {
    itens: [],
    adicionar: (item) =>{
        Carrinho.itens.push(item)
    },
    remover: (item) => {
        Carrinho.itens.forEach(e => {
            if ( item == e.nome ) {
                Carrinho.itens.splice(Carrinho.itens.indexOf(e), 1)
            }
        });
    },
    atualizar: () => {
        
        Carrinho.itens = []

        document.querySelectorAll('#lista_de_produtos ul').forEach(e =>{

            let imagem = e.children[0].children[0].getAttribute('src')
            let quantidade = Number(e.children[3].innerHTML)
            let nome = e.children[1].innerHTML
            let preco = Number(e.children[2].innerHTML.replace( /^\D+/g, '').replace( ',', '.'));

            if ( quantidade > 0 ) {

                Carrinho.adicionar({
                    imagem: imagem,
                    nome: nome,
                    quantidade: quantidade,
                    preco: preco
                })
                
            }

        })
    },
    carregar: ()=>{

        let lista_carrinho = $('#lista_do_carrinho')
        let listagem = ''

        let moeda = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        Carrinho.itens.forEach(item => {
            
            listagem += `
                <ul class="lista flex-row space">
                    <li> <img src='${item.imagem}'> </li>
                    <li>${item.nome}</li>
                    <li>${moeda.format( item.preco)}</li>
                    <li class='quantidade'>${item.quantidade}</li>
                    <li class="flex-row space">
                        <button class="btn_info add material-icons">add</button>
                        <button class="btn_danger remove material-icons">remove</button>
                    </li>
                </ul>
            `
        });

        lista_carrinho.html(listagem)
        Carrinho.calcular()
    },
    calcular: () => {

        let total = 0

        let moeda = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        document.querySelectorAll('#lista_do_carrinho ul').forEach(e =>{

            let quantidade = Number(e.children[3].innerHTML)
            let preco = Number(e.children[2].innerHTML.replace( /^\D+/g, '').replace( ',', '.'));

            if ( quantidade > 0 ) {

                total += (quantidade * preco)
                
            }

        })

        if ( $('.total') ) $('.total').html(moeda.format(total))

    }
}

// Funçoes de busca
const Busca = {
    iniciar: (termo) => {

        if ( termo.length < 3 )
        {
            carregaProdutos(lista)
            return
        }

        Busca._leitura(termo)

    },

    _leitura: (termo) => {
       
        let filtro = lista.filter(
            e => {
                return e.nome.includes(termo)
            }
        )

        carregaProdutos(filtro)

    },

}

// Função de adição de item
function adicionarItem(item) {

    let quantidade = Number(item.parent().parent().children('li:nth-child(4)').html())

    quantidade += 1

    item.parent().parent().children('li:nth-child(4)').html(quantidade)

    Carrinho.atualizar()

}

// Função de remoção de item
function removerItem(item) {


    let quantidade = Number(item.parent().parent().children('li:nth-child(4)').html())
    let nome = item.parent().parent().children('li:nth-child(2)').html()

    if ( quantidade > 0 ) 
    {
        quantidade -= 1

        item.parent().parent().children('li:nth-child(4)').html(quantidade)

        if ( quantidade == 1 ) Carrinho.remover(nome)
    }

    Carrinho.atualizar()
    
}

// Listeners
$(document).on('click', '.add', function(){

    let item = $(this)

    adicionarItem(item)
    Carrinho.calcular()
    
})

$(document).on('click', '.remove', function(){

    let item = $(this)

    removerItem(item)
    Carrinho.calcular()
    
})

$(document).on('keyup', '#termo', function(){

    let termo = $(this).val().trim()

    Busca.iniciar(termo)
})

$(document).on('click', '.concluir', function(){

    if ( Carrinho.itens.length > 0 )
    {
        $('#produtos').fadeOut('fast')
        $('#carrinho').fadeIn('fast')
    
        Carrinho.carregar()
    }
    
})

$(document).on('click', '.finalizar', function(){

    if ( Carrinho.itens.length > 0 )
    {
        $('#tela_de_pagamento').fadeIn('fast')
    
    }
    
})

carregaProdutos(lista)