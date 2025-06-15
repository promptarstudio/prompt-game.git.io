// js/engine.js

class GameEngine {
    /**
     * @param {string} configPath - Caminho para o arquivo config.json do tema.
     * @param {object} ui - O objeto UI que controla a interface.
     */
    constructor(configPath, ui) {
        this.configPath = configPath;
        this.ui = ui;
        
        this.config = null; // Onde guardaremos as configurações do tema carregado.
        this.state = {
            playerName: '',
            currentPhaseIndex: 0,
            currentQuestionIndex: 0,
            score: 0,
            themeTimer: null,
            questionTimer: null
        };
    }

    /**
     * Carrega o arquivo de configuração do tema.
     */
    async loadConfig() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Erro de rede ao carregar o config: ${response.statusText}`);
            }
            this.config = await response.json();
            console.log("Tema carregado:", this.config.themeName);
        } catch (error) {
            console.error("Não foi possível carregar ou interpretar o tema:", error);
        }
    }

    /**
     * Inicia o motor do jogo, carrega a configuração e prepara a tela inicial.
     */
    async init() {
        await this.loadConfig();
        if (!this.config) {
            console.error("Motor não pode iniciar sem configuração de tema.");
            return;
        }

        this.ui.setupInitialScreen(this.config.themeName);
        
        // Adiciona o listener para o botão de início do jogo.
        this.ui.elements.startButton.addEventListener('click', () => {
            const playerName = this.ui.elements.playerNameInput.value;
            if (playerName.trim()) {
                this.startGame(playerName);
            } else {
                alert('Por favor, digite seu nome para começar.');
            }
        });
    }

    /**
     * Inicia o jogo, esconde a tela de jogador e mostra a primeira fase.
     * @param {string} playerName - O nome do jogador.
     */
    startGame(playerName) {
        this.state.playerName = playerName;
        this.state.score = 0;
        console.log(`Jogador '${this.state.playerName}' iniciou o jogo.`);

        this.ui.hidePlayerScreenAndShowGame();
        this.showPhase(0); // Começa pela primeira fase (índice 0)
    }

    /**
     * Prepara e exibe uma fase específica do jogo.
     * @param {number} phaseIndex - O índice da fase a ser exibida.
     */
    showPhase(phaseIndex) {
        this.state.currentPhaseIndex = phaseIndex;
        this.state.currentQuestionIndex = 0; // Sempre começa na primeira pergunta da fase
        
        const phase = this.config.phases[phaseIndex];
        if (!phase) {
            console.error(`Fase com índice ${phaseIndex} não encontrada no config.json`);
            return;
        }

        this.ui.setBackground(this.config.assetsPath + phase.backgroundVideo);
        this.ui.displayPhaseTitle(phase.phaseTitle);

        if (phase.type === 'analysisModule') {
            this.ui.showAnalysisModule(phase);
        } else {
            this.showCurrentQuestion();
        }
    }

    /**
     * Pega a pergunta atual do estado do jogo e pede para a UI exibi-la.
     */
    showCurrentQuestion() {
        const phase = this.config.phases[this.state.currentPhaseIndex];
        const question = phase.questions[this.state.currentQuestionIndex];

        if (question) {
            // 1. A UI desenha a pergunta e o botão na tela.
            this.ui.showSingleFlashcard(question, this.config.assetsPath);

            // 2. O Motor, agora, encontra o botão que a UI acabou de criar.
            const nextButton = document.getElementById('next-question-btn');

            // 3. O Motor adiciona sua própria lógica de "próxima pergunta" ao clique do botão.
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    this.nextQuestion();
                }, { once: true }); // { once: true } é uma boa prática aqui. Garante que o evento só seja adicionado uma vez, evitando bugs de cliques múltiplos.
            }

        } else {
            // Se não houver mais perguntas, a fase terminou.
            console.log("Fim da fase! (Próximo passo: ir para a próxima fase ou tela de resultados)");
            // Futuramente, chamaria this.nextPhase() ou this.showResults()
        }
    }

    /**
     * Avança para a próxima pergunta da fase atual.
     */
    nextQuestion() {
        this.state.currentQuestionIndex++;
        this.showCurrentQuestion();
    }
}
