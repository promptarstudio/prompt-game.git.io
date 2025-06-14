// js/engine.js

class GameEngine {
    constructor(configPath, ui) {
        this.configPath = configPath; // Caminho para o config.json
        this.ui = ui; // Uma referência para o nosso objeto UI que cuidará da tela
        
        this.config = null; // Onde guardaremos as configurações do tema
        this.state = {
            playerName: '', // Adicionamos o nome do jogador ao estado
            currentPhaseIndex: 0,
            currentQuestionIndex: 0,
            score: 0,
            themeTimer: null,
            questionTimer: null
        };
    }

    // Método 1: Carrega o arquivo de configuração (permanece igual)
    async loadConfig() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Erro ao carregar o config: ${response.statusText}`);
            }
            this.config = await response.json();
            console.log("Tema carregado:", this.config.themeName);
        } catch (error) {
            console.error("Não foi possível carregar o tema:", error);
        }
    }

    // Método 2: Inicia o motor do jogo (ATUALIZADO)
    async init() {
        await this.loadConfig();
        if (!this.config) return;

        // Ordena à UI que mostre a tela inicial
        this.ui.setupInitialScreen(this.config.themeName);
        
        // Adiciona o "ouvinte" para o clique no botão de start
        this.ui.elements.startButton.addEventListener('click', () => {
            const playerName = this.ui.elements.playerNameInput.value;
            if (playerName.trim()) { // Garante que o nome não está vazio
                this.startGame(playerName);
            } else {
                alert('Por favor, digite seu nome para começar.');
            }
        });
    }

    // Método 3: Começa o jogo de fato (ATUALIZADO)
    startGame(playerName) {
        this.state.playerName = playerName; // Salva o nome do jogador
        this.state.currentPhaseIndex = 0;
        this.state.score = 0;
        
        console.log(`Jogador '${this.state.playerName}' iniciou o jogo.`);

        // Ordena à UI que esconda a tela de jogador e mostre a de jogo
        this.ui.hidePlayerScreenAndShowGame();
        
        // Carrega a primeira fase
        this.showPhase(this.state.currentPhaseIndex);
    }

    // Método 4: Mostra uma fase específica (permanece igual)
    showPhase(phaseIndex) {
        this.state.currentPhaseIndex = phaseIndex;
        this.state.currentQuestionIndex = 0;
        
        const phase = this.config.phases[phaseIndex];

        // Dá a ordem para a UI atualizar a tela
        this.ui.setBackground(this.config.assetsPath + phase.backgroundVideo);
        this.ui.displayPhaseTitle(phase.phaseTitle);

        if (phase.type === 'analysisModule') {
            this.ui.showAnalysisModule(phase);
        } else {
            // Passando também o caminho dos assets para a UI conseguir montar os links
        this.ui.showFlashcards(phase.questions, this.config.assetsPath);
        }
    }

    // ... aqui entrarão outros métodos: nextQuestion, updateScore, handleAnswer, etc.
}
