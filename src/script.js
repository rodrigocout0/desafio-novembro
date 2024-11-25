const apiUrl = 'https://ecom-back-strapi.onrender.com/api/products';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMyNTYxNTg1LCJleHAiOjE3MzUxNTM1ODV9.ImKzAYoR5hrPj_owNgUB7bKbGuMdb8H0dBtTr04VfZE';

let carrinho = [];  // armazenar produtos no carrinho

function configurarCabecalhos() {
    return {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
}

async function buscarProdutos() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: configurarCabecalhos()
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos: ' + response.status);
        }

        const data = await response.json();
        return data.data.map(produto => ({
            id: produto.id,
            nome: produto.attributes.nome,
            descricao: produto.attributes.descricao,
            preco: produto.attributes.preco,
            imagens: produto.attributes.imagens,
        }));
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        return [];
    }
}

function exibirProdutos(produtos) {
    const produtosContainer = document.getElementById('produtos-container');
    produtosContainer.innerHTML = ''; 

    if (produtos.length === 0) {
        produtosContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        const imagem = document.createElement('img');
        imagem.src = produto.imagens[0] || 'placeholder.png';
        imagem.alt = produto.nome;
        imagem.classList.add('produto-imagem');

        const nome = document.createElement('h2');
        nome.textContent = produto.nome;

        const preco = document.createElement('p');
        preco.textContent = `R$ ${produto.preco.toFixed(2)}`;
        preco.classList.add('produto-preco');

        const botaoComprar = document.createElement('button');
        botaoComprar.textContent = 'Adicionar ao Carrinho';
        botaoComprar.classList.add('botao-comprar');
        botaoComprar.onclick = () => adicionarAoCarrinho(produto);

        produtoDiv.appendChild(imagem);
        produtoDiv.appendChild(nome);
        produtoDiv.appendChild(preco);
        produtoDiv.appendChild(botaoComprar);

        produtosContainer.appendChild(produtoDiv);
    });
}

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const carrinhoBtn = document.getElementById('carrinho-btn');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCompra = document.getElementById('total-compra');
    listaCarrinho.innerHTML = '';

    carrinho.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        listaCarrinho.appendChild(itemLi);
    });

    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    totalCompra.textContent = `Total: R$ ${total.toFixed(2)}`;

    carrinhoBtn.textContent = `Carrinho (${carrinho.length})`;

    if (carrinho.length === 0) {
        carrinhoBtn.disabled = true;
    } else {
        carrinhoBtn.disabled = false;
    }
}

document.getElementById('carrinho-btn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'flex';
});

document.getElementById('fechar-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('finalizar-compra').addEventListener('click', () => {
    alert(`Compra finalizada! Total: R$ ${carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}`);
    carrinho = [];  
    atualizarCarrinho();  I
});

// Inicializa produtos quando carregar a pagina
window.onload = async () => {
    const produtos = await buscarProdutos();
    exibirProdutos(produtos);
};
