const form = document.querySelector('#form-distancia');
const campoOrigem = document.querySelector('#cepOrigem');
const campoDestino = document.querySelector('#cepDestino');
const campoCalcularRota = document.querySelector('#calcularRota');
const botaoCalcular = document.querySelector('#botao-calcular');
const caixaErro = document.querySelector('#mensagem-erro');
const secaoResultado = document.querySelector('#resultado');
const valorReta = document.querySelector('#valor-reta');
const valorRota = document.querySelector('#valor-rota');
const valorDuracao = document.querySelector('#valor-duracao');
const cardRota = document.querySelector('#card-rota');
const cardDuracao = document.querySelector('#card-duracao');
const listaOrigem = document.querySelector('#endereco-origem');
const listaDestino = document.querySelector('#endereco-destino');

const somenteDigitos = (valor) => valor.replace(/\D/g, '').slice(0, 8);

// A API exige 8 dígitos sem máscara: limpamos enquanto o usuário digita
[campoOrigem, campoDestino].forEach((campo) => {
    campo.addEventListener('input', () => {
        campo.value = somenteDigitos(campo.value);
    });
});

document.querySelectorAll('[data-exemplo]').forEach((botao) => {
    botao.addEventListener('click', () => {
        const [origem, destino] = botao.dataset.exemplo.split(',');
        campoOrigem.value = origem;
        campoDestino.value = destino;
        form.requestSubmit();
    });
});

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    esconderErro();
    secaoResultado.hidden = true;
    botaoCalcular.disabled = true;
    botaoCalcular.textContent = 'Calculando...';

    try {
        const resposta = await fetch('/api/distancia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cepOrigem: campoOrigem.value,
                cepDestino: campoDestino.value,
                calcularRota: campoCalcularRota.checked
            })
        });

        const dados = await resposta.json();

        // A API sempre responde JSON, inclusive nos erros
        if (!resposta.ok) {
            throw new Error(dados.mensagem || `Falha na requisição (HTTP ${resposta.status}).`);
        }

        mostrarResultado(dados);
    } catch (erro) {
        mostrarErro(erro.message);
    } finally {
        botaoCalcular.disabled = false;
        botaoCalcular.textContent = 'Calcular';
    }
});

function mostrarResultado(dados) {
    valorReta.textContent = dados.distanciaLinhaRetaKm.toFixed(2);

    const temRota = dados.distanciaRotaKm !== undefined;
    cardRota.hidden = !temRota;
    cardDuracao.hidden = !temRota;

    if (temRota) {
        valorRota.textContent = dados.distanciaRotaKm.toFixed(2);
        valorDuracao.textContent = dados.duracaoEstimadaMin;
    }

    preencherEndereco(listaOrigem, dados.enderecoOrigem);
    preencherEndereco(listaDestino, dados.enderecoDestino);

    secaoResultado.hidden = false;
}

function preencherEndereco(lista, endereco) {
    lista.replaceChildren();

    const linhas = [
        ['CEP', endereco.cep],
        ['Logradouro', endereco.logradouro],
        ['Complemento', endereco.complemento],
        ['Bairro', endereco.bairro],
        ['Cidade/UF', `${endereco.localidade} - ${endereco.uf}`]
    ];

    linhas.forEach(([rotulo, valor]) => {
        const termo = document.createElement('dt');
        const descricao = document.createElement('dd');

        // textContent, nunca innerHTML: os dados vêm de uma API externa
        termo.textContent = rotulo;
        descricao.textContent = valor || '—';

        lista.append(termo, descricao);
    });
}

function mostrarErro(mensagem) {
    caixaErro.textContent = mensagem;
    caixaErro.hidden = false;
}

function esconderErro() {
    caixaErro.hidden = true;
    caixaErro.textContent = '';
}
