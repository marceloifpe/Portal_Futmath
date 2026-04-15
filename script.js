const CONFIGURACAO = {
    urlApi: 'https://api.football-data.org/v4',
    chaveApi: '9c4b82e03de44aa4824b2c59c3a005e5',
    idSerieA: 2013,
    idSerieB: 2021,
    limiteRequisicoes: 10,
    tempoCache: 3600000,
};

let serieAtual = 'A';
let cache = {};

/**
 * Faz uma requisição GET para a API
 * @param {string} endpoint - Endpoint da API
 * @returns {Promise} - Resposta da API
 */
async function fazerRequisicaoApi(endpoint) {
    try {
        const chave = `cache_${endpoint}`;

        // Verificar cache
        if (cache[chave] && (Date.now() - cache[chave].tempo) < CONFIGURACAO.tempoCache) {
            console.log(`Usando cache para: ${endpoint}`);
            return cache[chave].dados;
        }

        const urlCompleta = `${CONFIGURACAO.urlApi}${endpoint}`;
        const opcoes = {
            headers: {
                'X-Auth-Token': CONFIGURACAO.chaveApi
            }
        };

        const resposta = await fetch(urlCompleta, opcoes);

        if (!resposta.ok) {
            throw new Error(`Erro na API: ${resposta.status} - ${resposta.statusText}`);
        }

        const dados = await resposta.json();

        cache[chave] = {
            dados: dados,
            tempo: Date.now()
        };

        return dados;
    } catch (erro) {
        console.error(`Erro ao fazer requisição para ${endpoint}:`, erro);
        mostrarMensagemErro(`Erro ao carregar dados: ${erro.message}`);
        return null;
    }
}

function mostrarMensagemErro(mensagem) {
    const gradeElemento = document.getElementById('grade-times');
    if (gradeElemento) {
        gradeElemento.innerHTML = `
            <div class="mensagem-carregamento" style="color: var(--cor-erro);">
                <p>⚠️ ${mensagem}</p>
            </div>
        `;
    }
}

function formatarData(data) {
    if (!data) return 'Data não disponível';
    const opcoes = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

function obterIdCompeticao(serie) {
    return serie === 'A' ? CONFIGURACAO.idSerieA : CONFIGURACAO.idSerieB;
}

function criarCartaoTime(time) {
    const cartao = document.createElement('article');
    cartao.className = 'cartao-time';
    cartao.setAttribute('data-time-id', time.id);
    cartao.setAttribute('role', 'button');
    cartao.setAttribute('tabindex', '0');
    cartao.setAttribute('aria-label', `Selecionar time ${time.name}`);

    const escudoUrl = time.crest || 'Imagens/placeholder-escudo.png';

    cartao.innerHTML = `
        <img src="${escudoUrl}" alt="Escudo do ${time.name}" class="escudo-time" onerror="this.src='Imagens/placeholder-escudo.png'">
        <h4 class="nome-time">${time.name}</h4>
        <p class="sigla-time">${time.tla || time.shortName || ''}</p>
    `;

    cartao.addEventListener('click', () => selecionarTime(time));
    cartao.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
            selecionarTime(time);
        }
    });

    return cartao;
}

function selecionarTime(time) {
    localStorage.setItem('timeAtual', JSON.stringify(time));
    localStorage.setItem('serieAtual', serieAtual);

    // CORREÇÃO: Devolvendo o redirecionamento para a página Hub do time!
    window.location.href = `paginas/time.html?id=${time.id}`;
}

async function carregarTimes(serie) {
    const gradeElemento = document.getElementById('grade-times');
    const elementoSerieAtual = document.getElementById('serie-selecionada');

    if (!gradeElemento) return;

    serieAtual = serie;
    if (serie === 'A') {
        elementoSerieAtual.parentElement.innerHTML = 'Times da Série <span id="serie-selecionada">A</span>';
    } else {
        elementoSerieAtual.parentElement.innerHTML = 'Times da <span id="serie-selecionada">Premier League</span>';
    }

    gradeElemento.innerHTML = '<div class="mensagem-carregamento"><p>Carregando times...</p></div>';

    const idCompeticao = obterIdCompeticao(serie);

    try {
        const dados = await fazerRequisicaoApi(`/competitions/${idCompeticao}/teams`);

        if (!dados) return;

        if (!dados.teams || dados.teams.length === 0) {
            mostrarMensagemErro('Nenhum time encontrado para esta competição.');
            return;
        }

        gradeElemento.innerHTML = '';

        dados.teams.forEach(time => {
            const cartao = criarCartaoTime(time);
            gradeElemento.appendChild(cartao);
        });

    } catch (erro) {
        console.error('Erro ao carregar times:', erro);
        mostrarMensagemErro('Erro ao carregar times. Tente novamente mais tarde.');
    }
}

function alternarBackground(serie) {
    const secaoHero = document.querySelector('.secao-apresentacao');

    if (!secaoHero) return;

    if (serie === 'A') {
        secaoHero.classList.add('bg-serie-a');
        secaoHero.classList.remove('bg-premier-league');
    } else {
        secaoHero.classList.add('bg-premier-league');
        secaoHero.classList.remove('bg-serie-a');
    }
}

function inicializarFiltros() {
    const botaoSerieA = document.getElementById('botao-serie-a');
    const botaoSerieB = document.getElementById('botao-serie-b');

    if (botaoSerieA) {
        botaoSerieA.addEventListener('click', () => {
            botaoSerieA.classList.add('ativo');
            botaoSerieB.classList.remove('ativo');
            alternarBackground('A');
            carregarTimes('A');
        });
    }

    if (botaoSerieB) {
        botaoSerieB.addEventListener('click', () => {
            botaoSerieB.classList.add('ativo');
            botaoSerieA.classList.remove('ativo');
            alternarBackground('B');
            carregarTimes('B');
        });
    }
}

function inicializarPagina() {
    console.log('Iniciando Portal Brasileirão...');
    if (CONFIGURACAO.chaveApi === '9c4b82e03de44aa4824b2c59c3a005e5') {
        console.warn('⚠️ Chave da API não configurada! Substitua a chave padrão pela sua chave do football-data.org');
    }
    inicializarFiltros();
    alternarBackground('A');
    carregarTimes('A');
}

async function carregarDetalhesTime(idTime) {
    try {
        return await fazerRequisicaoApi(`/teams/${idTime}`);
    } catch (erro) {
        console.error('Erro ao carregar detalhes do time:', erro);
        return null;
    }
}

async function carregarElenco(idTime) {
    try {
        return await fazerRequisicaoApi(`/teams/${idTime}/squad`);
    } catch (erro) {
        console.error('Erro ao carregar elenco:', erro);
        return null;
    }
}

async function carregarPartidas(idTime) {
    try {
        return await fazerRequisicaoApi(`/teams/${idTime}/matches`);
    } catch (erro) {
        console.error('Erro ao carregar partidas:', erro);
        return null;
    }
}

async function carregarTabela(idCompeticao) {
    try {
        return await fazerRequisicaoApi(`/competitions/${idCompeticao}/standings`);
    } catch (erro) {
        console.error('Erro ao carregar tabela:', erro);
        return null;
    }
}

function obterTimeAtual() {
    const timeJson = localStorage.getItem('timeAtual');
    return timeJson ? JSON.parse(timeJson) : null;
}

function obterSerieAtual() {
    return localStorage.getItem('serieAtual') || 'A';
}

function limparCache() {
    cache = {};
    console.log('Cache limpo');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPagina);
} else {
    inicializarPagina();
}

setInterval(limparCache, CONFIGURACAO.tempoCache);

window.PortalBrasileirao = {
    fazerRequisicaoApi,
    formatarData,
    obterIdCompeticao,
    carregarDetalhesTime,
    carregarElenco,
    carregarPartidas,
    carregarTabela,
    obterTimeAtual,
    obterSerieAtual,
    limparCache,
    CONFIGURACAO
};