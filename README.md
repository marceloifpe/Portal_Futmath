# Portal_Futmath

## 📋 Descrição

Portal Futmath é um projeto web desenvolvido para a disciplina de Desenvolvimento Web, ministrada pelo Professor Fabio Feliciano. O objetivo é criar uma plataforma estilo Transfermarkt focada exclusivamente nos times das Séries A do Brasileiro e Premier League da Inglaterra.

**Desenvolvido por:** Marcelo Augusto de Barros Araújo
**Data de Criação:** 15/04/2026
**Disciplina:** Desenvolvimento Web
**Professor:** Fabio Feliciano

## ✨ Funcionalidades Principais

- **Seleção de Times**: Navegue entre todos os times das Séries A do Brasileiro e Premier League da Inglaterra
- **Elencos Completos**: Visualize todos os jogadores com posição, número e informações detalhadas
- **Histórico de Jogadores**: Acompanhe a carreira completa de cada atleta
- **Partidas**: Confira últimas e próximas partidas do time
- **Estatísticas**: Dados gerais, posição na tabela e artilheiros
- **Conquistas**: Títulos e troféus conquistados pelos clubes
- **Design Responsivo**: Acesse em qualquer dispositivo (mobile, tablet, desktop)
- **Acessibilidade**: Navegação por teclado, atributos alt em imagens, semântica HTML

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com variáveis CSS, flexbox, grid e animações
- **JavaScript (Vanilla)**: Lógica de navegação e manipulação do DOM
- **API football-data.org**: Dados em tempo real sobre times, jogadores e partidas

## 📁 Estrutura do Projeto

```
Portal_Futmath/
├── index.html                    # Página inicial
├── style.css                     # Estilos globais
├── script.js                     # Lógica principal
├── LICENSE                       # Informações sobre a licença do projeto
├── README.md                     # Este arquivo
├── paginas/
│   ├── banco_titulos.json        # Carrega as informações de conquistas de cada time
│   ├── time.html                 # Detalhes do time
│   ├── elenco.html               # Lista de jogadores
│   ├── jogador.html              # Detalhes do jogador
│   ├── historico.html            # Histórico de clubes
│   ├── partidas.html             # Partidas do time
│   ├── conquistas.html           # Títulos e troféus
│   ├── estatisticas.html         # Dados gerais
│   ├── sobre.html                # Sobre o projeto
│   ├── contato.html              # Informações de contato
│   └── script-paginas.js         # Lógica das páginas internas
└── Imagens/
    ├── logo.jpg                  # Logo do site menu
    ├── github-logo.jpg           # Contato Redes Sociais img
    ├── instagram-logo.jpg        # Contato Redes Sociais img
    ├── instagram-logo.jpg        # Contato Redes Sociais img
    ├── likedin-logo.png          # Contato Redes Sociais img
    ├── Fundo_Premier_league.png  # Background Dinâmico img
    ├── Fundo_SerieA.png          # Background Dinâmico img


## 🚀 Como Usar

### 1. Configuração da API

Antes de usar o projeto, você precisa obter uma chave da API football-data.org:

1. Acesse [https://www.football-data.org/client/register](https://www.football-data.org/client/register)
2. Crie uma conta e obtenha sua chave de API
3. Abra o arquivo `script.js` e substitua a chave padrão:

```javascript
const CONFIGURACAO = {
    urlApi: 'https://api.football-data.org/v4',
    chaveApi: 'SUA_CHAVE_AQUI', // Substitua pela sua chave
    // ... resto da configuração
};
```

### 2. Abrir o Projeto

Como o projeto é estático (HTML, CSS, JS puro), você pode abrir de várias formas:

**Opção 1: Abrir arquivo diretamente**
```bash
# No Windows
start index.html

# No macOS
open index.html

# No Linux
xdg-open index.html
```

**Opção 2: Usar um servidor local (recomendado)**
```bash
# Com Python 3
python -m http.server 8000

# Com Python 2
python -m SimpleHTTPServer 8000

# Com Node.js (se tiver http-server instalado)
http-server

# Com PHP
php -S localhost:8000
```

Depois acesse `http://localhost:8000` no seu navegador.

### 3. Usar o Projeto

1. **Página Inicial**: Selecione a Liga (Brasileiro ou Premier League ) e clique em um time
2. **Detalhes do Time**: Veja informações gerais e últimas partidas
3. **Elenco**: Visualize todos os jogadores, com opção de filtrar por posição
4. **Jogador**: Clique em um jogador para ver detalhes e histórico
5. **Partidas**: Acompanhe próximas e últimas partidas
6. **Estatísticas**: Veja dados gerais do time na temporada
7. **Conquistas**: Explore títulos e troféus do clube
8. **Sobre**: Informações sobre o projeto e tecnologias
9. **Contato**: Formulário de contato e informações do desenvolvedor

## 🎨 Design

O projeto utiliza um design moderno e responsivo com:

- **Paleta de Cores**: Verde escuro (#1a472a), Amarelo (#f4d03f), Vermelho (#e74c3c)
- **Tipografia**: Segoe UI para corpo, Arial para títulos
- **Espaçamento**: Sistema de espaçamento consistente
- **Sombras**: Efeitos de profundidade sutis
- **Transições**: Animações suaves para melhor UX

## ♿ Acessibilidade

O projeto implementa várias práticas de acessibilidade:

- ✅ Atributos `alt` em todas as imagens
- ✅ Navegação por teclado completa
- ✅ Semântica HTML correta
- ✅ Contraste de cores adequado
- ✅ Atributos ARIA quando necessário
- ✅ Design responsivo para diferentes tamanhos de tela

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints em:

- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Grande**: 1280px+

## 🔧 Variáveis e Classes em Português-BR

Todas as variáveis JavaScript e classes CSS estão em português-br para facilitar o entendimento:

```javascript
// Exemplos de variáveis
const idTime = 123;
const nomeTime = "Flamengo";
const jogadores = [];
const partidas = [];
```

```css
/* Exemplos de classes */
.cabecalho { }
.navegacao { }
.grade-times { }
.cartao-time { }
.tabela-jogadores { }
```

## 📊 Limitações da API

- **Plano Gratuito**: 10 requisições por minuto
- **Cache**: Dados são armazenados em cache por 1 hora
- **Dados Históricos**: Alguns dados históricos podem não estar completos
- **Imagens**: Alguns escudos de times podem não estar disponíveis

## 🐛 Troubleshooting

### A página não carrega os times
- Verifique se a chave da API está correta em `script.js`
- Verifique a conexão com a internet
- Abra o console (F12) para ver mensagens de erro

### As imagens dos escudos não aparecem
- Isso é normal para alguns times, pois a API pode não ter a imagem
- O projeto usa um placeholder automático nestes casos

### O formulário de contato não funciona
- O formulário é apenas para demonstração
- Em um projeto real, seria necessário um backend para processar

## 📝 Notas de Desenvolvimento

- O projeto usa `localStorage` para armazenar o time selecionado
- Requisições à API são feitas com `fetch` e incluem cache
- O código está bem documentado com comentários
- Todas as funções estão disponíveis no objeto global `window.PortalBrasileirao`

## 🎓 Aprendizados

Este projeto demonstra:

- Estrutura HTML semântica
- CSS responsivo com variáveis
- JavaScript vanilla sem frameworks
- Integração com APIs RESTful
- Manipulação do DOM
- LocalStorage para persistência
- Boas práticas de acessibilidade
- Design mobile-first

## 📞 Contato

**Desenvolvedor**: Marcelo
**Email**: [marcelo513.ma@gmail.com]


## 📄 Licença

GNU GPL3

## 🙏 Agradecimentos

- Professor Fabio pela orientação
- football-data.org pela API gratuita
- Comunidade de desenvolvimento web

---

**Desenvolvido com ❤️ por Marcelo - 2026**
