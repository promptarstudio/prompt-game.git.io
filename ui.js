+++// js/ui.js

const UI = {
    // Guardamos referências aos elementos principais para não ter que buscá-los toda hora
    elements: {
        gameContainer: document.getElementById('game-container'),
        playerContainer: document.getElementById('player-container'),
        analysisModule: document.getElementById('analysis-module'),
        statusBar: document.getElementById('status-bar'),
        scoreInfo: document.getElementById('score-info'),
        timersBar: document.getElementById('timers-bar'),
        phaseTitle: document.getElementById('phase-title'), // Assumindo que temos um H1 com este ID
        background: document.getElementById('background-media') // Assumindo uma tag <video> ou <img> com este ID
    },

    // Ordem do Engine: "Prepare a tela inicial"
    setupInitialScreen(themeName) {
        document.title = themeName;
        // Poderíamos mostrar a tela de "digite seu nome" aqui
        this.elements.playerContainer.style.display = 'flex';
        this.elements.gameContainer.style.display = 'none';
        console.log(`UI: Tela inicial para o tema '${themeName}' preparada.`);
    },

    // Ordem do Engine: "Troque o vídeo de fundo"
    setBackground(mediaPath) {
        if (this.elements.background) {
            this.elements.background.src = mediaPath;
            this.elements.background.play();
            console.log(`UI: Background atualizado para ${mediaPath}`);
        }
    },

    // Ordem do Engine: "Mostre o título da fase"
    displayPhaseTitle(title) {
        if (this.elements.phaseTitle) {
            this.elements.phaseTitle.textContent = title;
            console.log(`UI: Título da fase exibido: ${title}`);
        }
    },

    // Ordem do Engine: "Mostre as perguntas da fase"
    showFlashcards(questions) {
        // Limpa o container do jogo
        this.elements.gameContainer.innerHTML = ''; 
        
        // Cria um elemento para o título
        const titleElement = document.createElement('h1');
        titleElement.id = 'phase-title';
        this.elements.gameContainer.appendChild(titleElement);
        // (Reatribui a referência no objeto elements)
        this.elements.phaseTitle = titleElement;
        
        // Loop para criar cada flashcard
        questions.forEach(questionData => {
            const card = document.createElement('div');
            card.className = 'flashcard'; // O tema vai estilizar isso
            card.textContent = questionData.question;
            this.elements.gameContainer.appendChild(card);
        });

        console.log(`UI: ${questions.length} flashcards exibidos.`);
    },

    // Ordem do Engine: "Ative o módulo de análise do Chefão"
    showAnalysisModule(phaseData) {
        this.elements.gameContainer.style.display = 'none';
        this.elements.analysisModule.style.display = 'flex'; // Mostra o container do chefão

        // Preenche os dados do desafio (briefing, etc.)
        const briefingEl = this.elements.analysisModule.querySelector('.briefing');
        if (briefingEl) {
            briefingEl.textContent = phaseData.briefing;
        }
        
        console.log("UI: Módulo de Análise (Chefão) ativado.");
    },

    // ... aqui entrarão outras funções: updateScore, updateTimer, createAnalysisFeedback, etc.
};
