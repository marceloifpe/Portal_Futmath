# ⚽ Portal Futmath

O **Portal Futmath** é uma plataforma web desenvolvida para fornecer informações detalhadas e atualizadas sobre times de futebol da **Série A do Campeonato Brasileiro** e da **Premier League**. O projeto foi concebido como parte da disciplina de Desenvolvimento Web, focando em uma interface limpa, semântica e de fácil leitura, este projeto foi inspirado no site transfermarkt que é uma das maiores base de dados de times e jogadores no mundo.

**Desenvolvido por:** Marcelo Augusto de Barros Araújo
**Data de Criação:** 15/04/2026
**Disciplina:** Desenvolvimento Web
**Professor:** Fabio Feliciano

---

## 🚀 Como Executar o Projeto

Para que o projeto funcione corretamente, é necessário lidar com as restrições de **CORS (Cross-Origin Resource Sharing)** da API `football-data.org` ao fazer requisições diretamente do navegador.

### 🔌 Requisito Obrigatório: Extensão CORS

Siga os passos abaixo para configurar seu navegador:

1.  **Instale a extensão**: Baixe a extensão **"Allow CORS: Access-Control-Allow-Origin"** (disponível para [Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafcepgpndahomeceholdnabeghid) e [Firefox](https://addons.mozilla.org/pt-BR/firefox/addon/access-control-allow-origin/)).
2.  **Ative a extensão**: Clique no ícone da extensão no seu navegador.
3.  **Ligue a chave**: Certifique-se de que o interruptor principal esteja na posição **"ON"** (geralmente fica laranja/colorido quando ativo).
4.  **Abra o projeto**: Agora você pode abrir o arquivo `index.html` no seu navegador e os dados dos times serão carregados normalmente.

---

## ✨ Funcionalidades Principais

- **Seleção de Ligas**: Alterne entre a Série A do Brasileirão e a Premier League com fundos dinâmicos.
- **Elencos Completos**: Visualize todos os jogadores com posição, número e informações detalhadas.
- **Tabelas de Dados**: Uso de tags `<table>`, `<tr>` e `<td>` para exibir estatísticas e elencos de forma organizada.
- **Estatísticas em Tempo Real**: Posição na tabela, gols marcados, vitórias e artilharia da competição.
- **Conquistas**: Histórico de títulos e troféus dos clubes (via JSON local).
- **Design Responsivo**: Interface adaptável para mobile, tablet e desktop.
- **Acessibilidade**: Uso de atributos `alt`, navegação por teclado e semântica HTML.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza as tecnologias fundamentais da web, priorizando a simplicidade e o uso de tags semânticas:

*   **HTML5**: Uso de tags estruturais (`<header>`, `<main>`, `<footer>`, `<section>`, `<article>`) e elementos de mídia.
*   **CSS3**: Estilização moderna com **Flexbox** e **Grid Layout**, além do uso de variáveis CSS para fácil manutenção.
*   **JavaScript (ES6+)**: Manipulação dinâmica do DOM, consumo de API REST via `fetch` e sistema de cache local.
*   **API football-data.org**: Fonte de dados em tempo real para elencos, partidas e estatísticas.

---

## 📁 Estrutura do Projeto

```text
Portal_Futmath/
├── index.html          # Página inicial com seleção de ligas
├── style.css           # Estilização global do projeto
├── script.js           # Lógica principal e integração com API
├── LICENSE             # Licença do projeto
├── README.md           # Este arquivo
├── Imagens/            # Ativos visuais (logos e fundos)
└── paginas/            # Páginas internas do portal
    ├── time.html       # Hub de informações do time selecionado
    ├── elenco.html     # Lista de jogadores (uso de tabelas HTML)
    ├── estatisticas.html # Dados de desempenho e artilharia
    ├── conquistas.html # Histórico de títulos (via JSON local)
    ├── contato.html    # Informações do desenvolvedor
    ├── banco_titulos.json # Banco de dados local de conquistas
    └── script-paginas.js # Lógica específica das páginas internas
```



---

## 🐛 Troubleshooting (Resolução de Problemas)

### A página não carrega os times?
- Verifique se a **Extensão CORS** está ativa (ON).
- Verifique se a chave da API em `script.js` ainda é válida.
- Abra o console do navegador (F12) para checar erros de rede.

### O formulário de contato não envia?
- O formulário na página de contato é ilustrativo para fins de design da disciplina. Em um ambiente real, seria necessário um serviço de backend.

---

## 👤 Contato

**Desenvolvedor:** Marcelo Augusto
**Email:** [marcelo513.ma@gmail.com]
**GitHub:** [marceloifpe](https://github.com/marceloifpe)
**LinkedIn:** [Marcelo Augusto](https://www.linkedin.com/in/marcelo-augusto-3b0692195/)

---
*Este projeto foi desenvolvido para fins educacionais e de portfólio - 2026*
