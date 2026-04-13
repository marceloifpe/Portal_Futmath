/* ============================================
   SCRIPT ESPECÍFICO PARA PÁGINAS INTERNAS
   Desenvolvido por: Marcelo
   Disciplina: Desenvolvimento Web - Prof. Fabio
   ============================================ */

// ============================================
// PÁGINA: time.html
// ============================================

async function inicializarPaginaTime() {
    const timeAtual = PortalBrasileirao.obterTimeAtual();

    if (!timeAtual) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const detalhesTime = await PortalBrasileirao.carregarDetalhesTime(timeAtual.id);

        if (detalhesTime) {
            document.getElementById('nome-time').textContent = detalhesTime.name || timeAtual.name;
            document.getElementById('escudo-time').src = detalhesTime.crest || timeAtual.crest || '../Imagens/placeholder-escudo.png';
            document.getElementById('escudo-time').alt = `Escudo do ${detalhesTime.name || timeAtual.name}`;

            const infoBasica = `
                Fundado em ${detalhesTime.founded || 'data desconhecida'} |
                ${detalhesTime.venue || 'Estádio não informado'}
            `;
            document.getElementById('info-time-basica').textContent = infoBasica;

            document.getElementById('estadio-time').textContent = detalhesTime.venue || '-';
            document.getElementById('fundacao-time').textContent = detalhesTime.founded || '-';
            document.getElementById('cores-time').textContent = detalhesTime.clubColors || '-';
            document.getElementById('website-time').innerHTML = detalhesTime.website
                ? `<a href="${detalhesTime.website}" target="_blank" rel="noopener noreferrer">${detalhesTime.website}</a>`
                : '-';
            document.getElementById('email-time').textContent = detalhesTime.email || '-';
            document.getElementById('telefone-time').textContent = detalhesTime.phone || '-';
        }

        await carregarUltimasPartidas(timeAtual.id);

    } catch (erro) {
        console.error('Erro ao inicializar página do time:', erro);
    }
}

async function carregarUltimasPartidas(idTime) {
    try {
        const partidas = await PortalBrasileirao.carregarPartidas(idTime);

        if (!partidas || !partidas.matches) {
            document.getElementById('lista-ultimas-partidas').innerHTML = '<p>Nenhuma partida encontrada.</p>';
            return;
        }

        const ultimasPartidas = partidas.matches
            .filter(p => p.status === 'FINISHED')
            .reverse()
            .slice(0, 5);

        let html = '';
        ultimasPartidas.forEach(partida => {
            const dataFormatada = PortalBrasileirao.formatarData(partida.utcDate);

            const placar = (partida.score && partida.score.fullTime && partida.score.fullTime.home !== null) ?
                `${partida.score.fullTime.home} x ${partida.score.fullTime.away}` :
                '- x -';

            html += `
                <div class="item-partida">
                    <div class="data-partida">${dataFormatada}</div>
                    <div class="times-partida">
                        <span class="time-partida">${partida.homeTeam?.name || '-'}</span>
                        <span class="placar-partida">${placar}</span>
                        <span class="time-partida">${partida.awayTeam?.name || '-'}</span>
                    </div>
                </div>
            `;
        });

        document.getElementById('lista-ultimas-partidas').innerHTML = html;

    } catch (erro) {
        console.error('Erro ao carregar partidas:', erro);
    }
}

// ============================================
// PÁGINA: elenco.html
// ============================================

let elencoCompleto = [];
let posicaoFiltrada = 'todos';

function traduzirPosicao(posicaoIngles) {
    if (!posicaoIngles) return '-';

    if (posicaoIngles.includes('Goalkeeper')) return 'Goleiro';
    if (posicaoIngles.includes('Midfield')) return 'Meio-campista';
    if (posicaoIngles.includes('Defen') || posicaoIngles.includes('Back')) return 'Defensor';
    if (posicaoIngles.includes('Forward') || posicaoIngles.includes('Winger') ||
        posicaoIngles.includes('Attack') || posicaoIngles.includes('Offence') ||
        posicaoIngles.includes('Striker')) return 'Atacante';

    return posicaoIngles;
}

async function inicializarPaginaElenco() {
    const timeAtual = PortalBrasileirao.obterTimeAtual();

    if (!timeAtual) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('nome-time-elenco').textContent = timeAtual.name;

    try {
        const detalhes = await PortalBrasileirao.carregarDetalhesTime(timeAtual.id);

        if (!detalhes || !detalhes.squad) {
            document.getElementById('corpo-tabela-jogadores').innerHTML =
                '<tr><td colspan="5" style="text-align: center;">Nenhum jogador encontrado para este time.</td></tr>';
            return;
        }

        elencoCompleto = detalhes.squad;
        preencherTabelaJogadores(elencoCompleto);

        document.querySelectorAll('.botao-filtro-pos').forEach(botao => {
            botao.addEventListener('click', function() {
                document.querySelectorAll('.botao-filtro-pos').forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');
                posicaoFiltrada = this.dataset.posicao;
                filtrarJogadores();
            });
        });

    } catch (erro) {
        console.error('Erro ao carregar elenco:', erro);
    }
}

function preencherTabelaJogadores(jogadores) {
    const corpoTabela = document.getElementById('corpo-tabela-jogadores');

    if (!jogadores || jogadores.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum jogador encontrado.</td></tr>';
        return;
    }

    let html = '';
    jogadores.forEach(jogador => {
        const numero = jogador.shirtNumber || '-';
        const nome = jogador.name || '-';
        const posicao = traduzirPosicao(jogador.position);
        const dataNascimento = PortalBrasileirao.formatarData(jogador.dateOfBirth);
        const nacionalidade = jogador.nationality || '-';

        html += `
            <tr class="linha-jogador" data-posicao="${jogador.position || ''}">
                <td class="numero-jogador">${numero}</td>
                <td class="nome-jogador"><a href="jogador.html?id=${jogador.id}">${nome}</a></td>
                <td class="posicao-jogador">${posicao}</td>
                <td class="data-jogador">${dataNascimento}</td>
                <td class="nacionalidade-jogador">${nacionalidade}</td>
            </tr>
        `;
    });

    corpoTabela.innerHTML = html;
}

function filtrarJogadores() {
    const linhas = document.querySelectorAll('.linha-jogador');
    let contagemVisivel = 0;

    linhas.forEach(linha => {
        const posJogador = linha.dataset.posicao || '';
        let deveMostrar = false;

        if (posicaoFiltrada === 'todos') {
            deveMostrar = true;
        } else if (posicaoFiltrada === 'Midfielder' && posJogador.includes('Midfield')) {
            deveMostrar = true;
        } else if (posicaoFiltrada === 'Defender' && (posJogador.includes('Defen') || posJogador.includes('Back')) && !posJogador.includes('Midfield')) {
            deveMostrar = true;
        } else if (posicaoFiltrada === 'Attacker' && (posJogador.includes('Forward') || posJogador.includes('Winger') || posJogador.includes('Attack') || posJogador.includes('Offence') || posJogador.includes('Striker'))) {
            deveMostrar = true;
        } else if (posicaoFiltrada === 'Goalkeeper' && posJogador.includes('Goalkeeper')) {
            deveMostrar = true;
        }

        if (deveMostrar) {
            linha.style.display = '';
            contagemVisivel++;
        } else {
            linha.style.display = 'none';
        }
    });

    const mensagem = document.getElementById('mensagem-sem-resultados');
    if (contagemVisivel === 0) {
        mensagem.classList.remove('oculto');
    } else {
        mensagem.classList.add('oculto');
    }
}

// ============================================
// PÁGINA: jogador.html
// ============================================

async function inicializarPaginaJogador() {
    const urlParams = new URLSearchParams(window.location.search);
    const idJogador = urlParams.get('id');

    if (!idJogador) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const jogador = await PortalBrasileirao.fazerRequisicaoApi(`/persons/${idJogador}`);

        if (!jogador) {
            document.querySelector('.secao-jogador').innerHTML = '<p>Jogador não encontrado na API.</p>';
            return;
        }

        document.getElementById('nome-jogador').textContent = jogador.name || '-';
        document.getElementById('numero-jogador').textContent = jogador.shirtNumber || '-';
        document.getElementById('posicao-jogador').textContent = traduzirPosicao(jogador.position);
        document.getElementById('nacionalidade-jogador').textContent = jogador.nationality || '-';

        document.getElementById('data-nascimento').textContent = PortalBrasileirao.formatarData(jogador.dateOfBirth);
        document.getElementById('nacionalidade-completa').textContent = jogador.nationality || '-';
        document.getElementById('numero-camisa').textContent = jogador.shirtNumber || '-';

        if (jogador.dateOfBirth) {
            const idade = calcularIdade(new Date(jogador.dateOfBirth));
            document.getElementById('idade-jogador').textContent = `${idade} anos`;
        }

    } catch (erro) {
        console.error('Erro ao carregar dados do jogador:', erro);
    }
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade;
}

// ============================================
// PÁGINA: partidas.html
// ============================================

let partidasGlobais = [];
let tipoPartidaAtual = 'proximas';
let quantidadePartidas = 5;

async function inicializarPaginaPartidas() {
    const timeAtual = PortalBrasileirao.obterTimeAtual();

    if (!timeAtual) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('nome-time-partidas').textContent = timeAtual.name;

    const containerAbas = document.querySelector('.abas-partidas');
    if (containerAbas && !document.getElementById('filtro-qtd')) {
        const controleQuantidade = document.createElement('div');
        controleQuantidade.style.marginLeft = 'auto';
        controleQuantidade.style.display = 'flex';
        controleQuantidade.style.alignItems = 'center';
        controleQuantidade.style.gap = '10px';

        controleQuantidade.innerHTML = `
            <label for="filtro-qtd" style="font-weight: bold; font-size: 0.95em;">Mostrar:</label>
            <select id="filtro-qtd" style="padding: 5px; border-radius: 5px; border: 1px solid #ccc; outline: none; cursor: pointer; font-family: inherit;">
                <option value="5" selected>5 partidas</option>
                <option value="4">4 partidas</option>
                <option value="3">3 partidas</option>
                <option value="2">2 partidas</option>
                <option value="1">1 partida</option>
                <option value="todas">Todas</option>
            </select>
        `;

        containerAbas.style.display = 'flex';
        containerAbas.style.alignItems = 'center';
        containerAbas.appendChild(controleQuantidade);

        document.getElementById('filtro-qtd').addEventListener('change', (e) => {
            const valor = e.target.value;
            quantidadePartidas = valor === 'todas' ? 'todas' : parseInt(valor);
            exibirPartidas(partidasGlobais, tipoPartidaAtual);
        });
    }

    try {
        const partidas = await PortalBrasileirao.carregarPartidas(timeAtual.id);

        if (!partidas || !partidas.matches) {
            document.getElementById('lista-partidas').innerHTML = '<p>Nenhuma partida encontrada.</p>';
            return;
        }

        partidasGlobais = partidas.matches;

        document.getElementById('aba-proximas').addEventListener('click', () => {
            document.querySelectorAll('.aba-partida').forEach(a => a.classList.remove('ativa'));
            document.getElementById('aba-proximas').classList.add('ativa');
            tipoPartidaAtual = 'proximas';
            exibirPartidas(partidasGlobais, tipoPartidaAtual);
        });

        document.getElementById('aba-ultimas').addEventListener('click', () => {
            document.querySelectorAll('.aba-partida').forEach(a => a.classList.remove('ativa'));
            document.getElementById('aba-ultimas').classList.add('ativa');
            tipoPartidaAtual = 'ultimas';
            exibirPartidas(partidasGlobais, tipoPartidaAtual);
        });

        exibirPartidas(partidasGlobais, tipoPartidaAtual);

    } catch (erro) {
        console.error('Erro ao carregar partidas:', erro);
    }
}

function exibirPartidas(partidas, tipo) {
    const listaElement = document.getElementById('lista-partidas');
    let partidasFiltradas = [];

    if (tipo === 'proximas') {
        partidasFiltradas = partidas.filter(p => p.status !== 'FINISHED');
    } else {
        partidasFiltradas = partidas.filter(p => p.status === 'FINISHED').reverse();
    }

    if (quantidadePartidas !== 'todas') {
        partidasFiltradas = partidasFiltradas.slice(0, quantidadePartidas);
    }

    if (partidasFiltradas.length === 0) {
        listaElement.innerHTML = '<p>Nenhuma partida encontrada.</p>';
        return;
    }

    let html = '';
    partidasFiltradas.forEach(partida => {
        const dataFormatada = PortalBrasileirao.formatarData(partida.utcDate);

        const placar = (partida.score && partida.score.fullTime && partida.score.fullTime.home !== null) ?
            `${partida.score.fullTime.home} x ${partida.score.fullTime.away}` :
            '- x -';

        html += `
            <div class="cartao-partida">
                <div class="info-partida">
                    <div class="data-partida">${dataFormatada}</div>
                    <div class="times-partida">
                        <span class="time-partida">${partida.homeTeam?.name || '-'}</span>
                        <span class="placar-partida">${placar}</span>
                        <span class="time-partida">${partida.awayTeam?.name || '-'}</span>
                    </div>
                    <div class="status-partida">${partida.status}</div>
                </div>
            </div>
        `;
    });

    listaElement.innerHTML = html;
}

// ============================================
// PÁGINA: estatisticas.html
// ============================================

let artilheirosGlobais = [];

async function inicializarPaginaEstatisticas() {
    const timeAtual = PortalBrasileirao.obterTimeAtual();
    const serieAtual = PortalBrasileirao.obterSerieAtual();

    if (!timeAtual) {
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('nome-time-stats').textContent = timeAtual.name;

    try {
        const idCompeticao = PortalBrasileirao.obterIdCompeticao(serieAtual);

        const tabela = await PortalBrasileirao.carregarTabela(idCompeticao);

        if (tabela && tabela.standings && tabela.standings[0]) {
            const standings = tabela.standings[0].table;
            const timeStanding = standings.find(t => t.team.id === timeAtual.id);

            if (timeStanding) {
                exibirPosicaoTabela(timeStanding);
                exibirEstatisticasGerais(timeStanding);
            }
        }

        const endpointArtilheiros = `/competitions/${idCompeticao}/scorers`;
        const dadosArtilheiros = await PortalBrasileirao.fazerRequisicaoApi(endpointArtilheiros);

        if (dadosArtilheiros && dadosArtilheiros.scorers && dadosArtilheiros.scorers.length > 0) {
            artilheirosGlobais = dadosArtilheiros.scorers;

            const secaoArtilheiros = document.querySelector('.secao-artilheiros');
            if (secaoArtilheiros && !document.getElementById('filtro-nome-artilheiro')) {
                const containerFiltros = document.createElement('div');
                containerFiltros.style.display = 'flex';
                containerFiltros.style.gap = '15px';
                containerFiltros.style.marginBottom = '20px';
                containerFiltros.style.flexWrap = 'wrap';

                const timesSet = new Set();
                artilheirosGlobais.forEach(a => timesSet.add(a.team.shortName || a.team.name));
                const timesUnicos = Array.from(timesSet).sort();

                let opcoesTimes = '<option value="todos">Todos os Times</option>';
                timesUnicos.forEach(time => {
                    opcoesTimes += `<option value="${time}">${time}</option>`;
                });

                containerFiltros.innerHTML = `
                    <input type="text" id="filtro-nome-artilheiro" placeholder="Buscar por jogador..." style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; flex: 1; min-width: 200px; outline: none; font-family: inherit;">
                    <select id="filtro-time-artilheiro" style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; outline: none; cursor: pointer; font-family: inherit; min-width: 200px;">
                        ${opcoesTimes}
                    </select>
                `;

                const tabelaResponsiva = secaoArtilheiros.querySelector('.tabela-responsiva');
                secaoArtilheiros.insertBefore(containerFiltros, tabelaResponsiva);

                document.getElementById('filtro-nome-artilheiro').addEventListener('input', renderizarTabelaArtilheiros);
                document.getElementById('filtro-time-artilheiro').addEventListener('change', renderizarTabelaArtilheiros);
            }

            const tituloArtilheiros = document.querySelector('.secao-artilheiros .titulo-secao');
            if (tituloArtilheiros) {
                tituloArtilheiros.textContent = 'Top 10 Artilheiros do Campeonato';
            }

            renderizarTabelaArtilheiros();

        } else {
            document.getElementById('corpo-tabela-artilheiros').innerHTML = '<tr><td colspan="3" style="text-align: center;">Dados de artilharia indisponíveis na API no momento.</td></tr>';
        }

    } catch (erro) {
        console.error('Erro ao carregar estatísticas:', erro);
        const corpoTabelaArtilheiros = document.getElementById('corpo-tabela-artilheiros');
        if (corpoTabelaArtilheiros) {
            corpoTabelaArtilheiros.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">Erro ao carregar artilheiros.</td></tr>';
        }
    }
}

function renderizarTabelaArtilheiros() {
    const corpoTabela = document.getElementById('corpo-tabela-artilheiros');
    const inputBusca = document.getElementById('filtro-nome-artilheiro');
    const selectTime = document.getElementById('filtro-time-artilheiro');

    const termoBusca = inputBusca ? inputBusca.value.toLowerCase() : '';
    const timeFiltro = selectTime ? selectTime.value : 'todos';

    const artilheirosFiltrados = artilheirosGlobais.filter(artilheiro => {
        const nomeJogador = artilheiro.player.name.toLowerCase();
        const nomeTime = artilheiro.team.shortName || artilheiro.team.name;

        const atendeBuscaTexto = nomeJogador.includes(termoBusca);
        const atendeFiltroTime = (timeFiltro === 'todos') || (nomeTime === timeFiltro);

        return atendeBuscaTexto && atendeFiltroTime;
    });

    if (artilheirosFiltrados.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">Nenhum artilheiro encontrado com esses filtros.</td></tr>';
        return;
    }

    let htmlArtilheiros = '';

    artilheirosFiltrados.forEach((artilheiro) => {
        const nomeJogador = artilheiro.player.name;
        const nomeTime = artilheiro.team.shortName || artilheiro.team.name;
        const gols = artilheiro.goals;

        const posicaoOriginal = artilheirosGlobais.indexOf(artilheiro) + 1;

        htmlArtilheiros += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="text-align: center;">${posicaoOriginal}º</td>
                <td>
                    <strong>${nomeJogador}</strong><br>
                    <small style="color: #555; font-weight: 600;">${nomeTime}</small>
                </td>
                <td style="text-align: center; font-weight: bold; font-size: 1.1em;">${gols}</td>
            </tr>
        `;
    });

    corpoTabela.innerHTML = htmlArtilheiros;
}

function exibirPosicaoTabela(timeStanding) {
    const cartao = document.getElementById('cartao-posicao');

    const html = `
        <div class="info-posicao">
            <div class="posicao-numero">
                <span class="numero-posicao">${timeStanding.position}º</span>
                <span class="texto-posicao">Posição</span>
            </div>
            <div class="pontos-posicao">
                <span class="numero-pontos">${timeStanding.points}</span>
                <span class="texto-pontos">Pontos</span>
            </div>
            <div class="jogos-posicao">
                <span class="numero-jogos">${timeStanding.playedGames}</span>
                <span class="texto-jogos">Jogos</span>
            </div>
        </div>
    `;

    cartao.innerHTML = html;
}

function exibirEstatisticasGerais(timeStanding) {
    document.getElementById('stat-vitorias').textContent = timeStanding.won || '0';
    document.getElementById('stat-empates').textContent = timeStanding.draw || '0';
    document.getElementById('stat-derrotas').textContent = timeStanding.lost || '0';
    document.getElementById('stat-gols-marcados').textContent = timeStanding.goalsFor || '0';
    document.getElementById('stat-gols-sofridos').textContent = timeStanding.goalsAgainst || '0';
    document.getElementById('stat-diferenca-gols').textContent = timeStanding.goalDifference || '0';
}

// ============================================
// PÁGINA: conquistas.html
// ============================================

async function inicializarPaginaConquistas() {
    const timeAtual = PortalBrasileirao.obterTimeAtual();

    if (!timeAtual) {
        window.location.href = '../index.html';
        return;
    }

    const tituloTags = document.querySelectorAll('h2');
    tituloTags.forEach(h2 => {
        if (h2.textContent.includes('Conquistas')) {
            h2.textContent = `Conquistas - ${timeAtual.name}`;
        }
    });

    try {
        const detalhesTime = await PortalBrasileirao.carregarDetalhesTime(timeAtual.id);

        let bancoDadosLocal = {};
        try {
            const respostaJson = await fetch('banco_titulos.json');
            if (respostaJson.ok) {
                bancoDadosLocal = await respostaJson.json();
            } else {
                console.warn('Arquivo JSON encontrado, mas houve um erro ao ler.', respostaJson.status);
            }
        } catch (erroJson) {
            console.warn('Aviso: Arquivo banco_titulos.json não encontrado ou erro de rede.', erroJson);
        }

        const dadosLocaisDoTime = bancoDadosLocal[timeAtual.name];

        const tabelaCorpo = document.querySelector('tbody');
        if (tabelaCorpo) {
            if (dadosLocaisDoTime && dadosLocaisDoTime.historicoTitulos) {
                let htmlTitulos = '';
                dadosLocaisDoTime.historicoTitulos.forEach(titulo => {
                    htmlTitulos += `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 15px;"><strong>${titulo.nome}</strong></td>
                            <td style="text-align: center; font-weight: bold; font-size: 1.1em;">${titulo.quantidade}</td>
                            <td style="text-align: center;">${titulo.ultimoAno}</td>
                        </tr>
                    `;
                });
                tabelaCorpo.innerHTML = htmlTitulos;
            } else {
                tabelaCorpo.innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center; padding: 20px;">
                            ⚠️ A API gratuita não disponibiliza o histórico de troféus e este time ainda não foi cadastrado no banco local.<br>
                            Mas sabemos que o <strong>${timeAtual.name}</strong> tem uma história gigante!
                        </td>
                    </tr>
                `;
            }
        }

        const msgCarregando = Array.from(document.querySelectorAll('.mensagem-carregamento'))
            .find(el => el.textContent.includes('Carregando conquistas'));

        // Mantido 100% via API conforme solicitado
        if (msgCarregando) {
            if (detalhesTime && detalhesTime.runningCompetitions && detalhesTime.runningCompetitions.length > 0) {
                let html = `
                    <p style="text-align: center; margin-bottom: 10px;"><strong>Competições disputadas na temporada atual:</strong></p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
                `;
                detalhesTime.runningCompetitions.forEach(comp => {
                    html += `<span style="background: var(--cor-primaria, #1e5c3a); color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">🏆 ${comp.name}</span>`;
                });
                html += `</div>`;
                msgCarregando.outerHTML = html;
            } else {
                msgCarregando.innerHTML = '<p style="text-align: center;">Nenhuma competição em andamento encontrada.</p>';
            }
        }

    } catch (erro) {
        console.error('Erro ao carregar conquistas:', erro);
    }
}

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const caminhoAtual = window.location.pathname;

    if (caminhoAtual.includes('time.html')) {
        inicializarPaginaTime();
    } else if (caminhoAtual.includes('elenco.html')) {
        inicializarPaginaElenco();
    } else if (caminhoAtual.includes('jogador.html')) {
        inicializarPaginaJogador();
    } else if (caminhoAtual.includes('partidas.html')) {
        inicializarPaginaPartidas();
    } else if (caminhoAtual.includes('estatisticas.html')) {
        inicializarPaginaEstatisticas();
    } else if (caminhoAtual.includes('conquistas.html')) {
        inicializarPaginaConquistas();
    }
});