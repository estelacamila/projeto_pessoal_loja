document.addEventListener('DOMContentLoaded', () => {
    const produtosContainer = document.getElementById('produtos');
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    const itensCarrinhoContainer = document.getElementById('itens-carrinho');
    const totalCarrinhoSpan = document.getElementById('total-carrinho');
    const carrinhoVazioMsg = document.getElementById('carrinho-vazio-msg');
    const cartToggleBtn = document.getElementById('cart-toggle');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');
    const cartOverlay = document.getElementById('cart-overlay');
    const finalizarCompraBtn = document.querySelector('.finalizar-compra');

    let carrinho = [];

    const numeroWhatsapp = '5517991496548';

    function openCart() {
        carrinhoSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        carrinhoSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function atualizarCarrinhoHTML() {
        itensCarrinhoContainer.innerHTML = '';

        if (carrinho.length === 0) {
            carrinhoVazioMsg.style.display = 'block';
        } else {
            carrinhoVazioMsg.style.display = 'none';
            carrinho.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('carrinho-item');
                itemDiv.dataset.id = item.id;

                itemDiv.innerHTML = `
                    <div class="carrinho-item-info">
                        <h4>${item.nome}</h4>
                        <p>R$ ${item.preco.toFixed(2)} cada</p>
                    </div>
                    <div class="quantidade-controle">
                        <button class="diminuir-quantidade">-</button>
                        <span>${item.quantidade}</span>
                        <button class="aumentar-quantidade">+</button>
                        <button class="remover-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
    </svg></button>
                    </div>
                `;
                itensCarrinhoContainer.appendChild(itemDiv);
            });
        }
        calcularTotalCarrinho();
        atualizarContadorCarrinho();
    }

    function calcularTotalCarrinho() {
        let total = 0;
        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
        });
        totalCarrinhoSpan.textContent = total.toFixed(2);
    }

    function atualizarContadorCarrinho() {
        let totalItens = 0;
        carrinho.forEach(item => {
            totalItens += item.quantidade;
        });
        cartCountSpan.textContent = totalItens;
        cartCountSpan.style.display = totalItens > 0 ? 'inline-block' : 'none';
    }

    produtosContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('adicionar-carrinho')) {
            const produtoCard = event.target.closest('.produto-card');
            const id = parseInt(produtoCard.dataset.id);
            const nome = produtoCard.dataset.nome;
            const preco = parseFloat(produtoCard.dataset.preco);

            const itemExistente = carrinho.find(item => item.id === id);

            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({ id, nome, preco, quantidade: 1 });
            }
            atualizarCarrinhoHTML();
            openCart();
        }
    });

    itensCarrinhoContainer.addEventListener('click', (event) => {
        const itemDiv = event.target.closest('.carrinho-item');
        if (!itemDiv) return;

        const id = parseInt(itemDiv.dataset.id);
        const itemIndex = carrinho.findIndex(item => item.id === id);

        if (itemIndex > -1) {
            if (event.target.classList.contains('aumentar-quantidade')) {
                carrinho[itemIndex].quantidade++;
            } else if (event.target.classList.contains('diminuir-quantidade')) {
                if (carrinho[itemIndex].quantidade > 1) {
                    carrinho[itemIndex].quantidade--;
                } else {
                    carrinho.splice(itemIndex, 1);
                }
            } else if (event.target.classList.contains('remover-item')) {
                carrinho.splice(itemIndex, 1);
            }
            atualizarCarrinhoHTML();
        }
    });

    cartToggleBtn.addEventListener('click', openCart);

    closeCartBtn.addEventListener('click', closeCart);

    cartOverlay.addEventListener('click', closeCart);

    finalizarCompraBtn.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Sua sacola está vazia. Adicione alguns itens antes de finalizar o pedido.');
            return;
        }

        let mensagemWhatsapp = 'Olá! Gostaria de fazer o seguinte pedido na Chic Boutique:\n\n';
        carrinho.forEach(item => {
            mensagemWhatsapp += `- ${item.quantidade}x ${item.nome} (R$ ${item.preco.toFixed(2)} cada)\n`;
        });
        mensagemWhatsapp += `\nTotal do Pedido: R$ ${totalCarrinhoSpan.textContent}`;
        mensagemWhatsapp += '\n\nPor favor, me informe sobre as opções de pagamento e entrega.';

        const mensagemCodificada = encodeURIComponent(mensagemWhatsapp);

        const whatsappLink = `https://wa.me/${numeroWhatsapp}?text=${mensagemCodificada}`;

        window.open(whatsappLink, '_blank');

        carrinho = [];
        atualizarCarrinhoHTML();
        closeCart();
    });

    atualizarCarrinhoHTML();
});
