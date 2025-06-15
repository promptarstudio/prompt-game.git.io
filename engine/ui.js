// js/ui.js

const UI = {
    // Guardamos referências aos elementos principais
    elements: {
        gameContainer: document.getElementById('game-container'),
        playerContainer: document.getElementById('player-container'),
        analysisModule: document.getElementById('analysis-module'),
        statusBar: document.getElementById('status-bar'),
        scoreInfo: document.getElementById('score-info'),
        timersBar: document.getElementById('timers-bar'),
        phaseTitle: document.getElementById('phase-title'),
        background: document.getElementById('background-media'),
        playerNameInput: document.getElementById('player-name'),
        startButton: document.getElementById('start-game')
    },

    // Prepara a tela inicial para o jogador
    setupInitialScreen(themeName) {
        document.title = themeName;
        this.elements.playerContainer.style.display = 'flex';
        this.elements.gameContainer.style.display = 'none';
        this.elements.analysisModule.style.display = 'none';
        console.log(`UI: Tela inicial para o tema '${themeName}' preparada.`);
    },
    
    // Faz a transição da tela de início para a tela principal do jogo
    hidePlayerScreenAndShowGame() {
        this.elements.playerContainer.style.display = 'none';
        this.elements.gameContainer.style.display = 'flex';
        console.log("UI: Transição para a tela de jogo executada.");
    },

    // Define o vídeo/imagem de fundo da fase
    setBackground(mediaPath) {
        if (this.elements.background) {
            this.elements.background.src = mediaPath;
            this.elements.background.play().catch(e => console.error("Erro ao tocar mídia de fundo:", e));
        }
    },

    // Mostra o título da fase no topo da tela do jogo
    displayPhaseTitle(title) {
        if (this.elements.phaseTitle) {
            this.elements.phaseTitle.textContent = title;
        }
    },

    // Desenha apenas um flashcard na tela
    showSingleFlashcard(questionData, assetsPath) {
        const gameContainer = this.elements.gameContainer;
        gameContainer.innerHTML = ''; // Limpa a tela para a nova pergunta

        // Cria o card
        const card = document.createElement('div');
        card.className = 'flashcard';
        
        // Adiciona a mídia (se houver)
        if (questionData.video) {
            const mediaContainer = document.createElement('div');
            mediaContainer.className = 'flashcard-media';
            const video = document.createElement('video');
            video.src = `${assetsPath}videos/${questionData.video}`;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            mediaContainer.appendChild(video);
            card.appendChild(mediaContainer);
        }

        // Adiciona o texto da pergunta
        const questionText = document.createElement('p');
        questionText.className = 'flashcard-question';
        questionText.textContent = questionData.question;
        card.appendChild(questionText);

        // Adiciona o card pronto ao container
        gameContainer.appendChild(card);
        
        // Adiciona o botão de ação
        const nextButton = document.createElement('button');
        nextButton.id = 'next-question-btn';
        nextButton.className = 'btn';
        nextButton.textContent = 'Responder';
        gameContainer.appendChild(nextButton);
    }
    // A chave extra foi removida daqui.
};
