/**
 * Terminal Popup - Para botoes/links sem funcionalidade
 * Tema: Mr. Robot / fsociety
 */
(function() {
    'use strict';

    // Frase do popup
    const frase = "Para de tentar quebrar meu site, otaro!!!";

    // ASCII art do Nyan Cat
    const asciiArt = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░░░░░░
░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░░░░░░░░░░
░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░░░░░░░░░░
░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░░░░░░░░░░
░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░░░░░░░░░░
░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░░░░░░░░░░
░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░░░░░░░░░░
░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░░░░░░░░░░
░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░░░░░░░░░░
░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░░░░░░░░░░
░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░░░░░░░░░
░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░░░░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    `;

    // Cria o CSS do popup
    function injetarCSS() {
        const style = document.createElement('style');
        style.id = 'terminal-popup-styles';
        style.textContent = `
            .terminal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease, visibility 0.2s ease;
            }
            .terminal-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .terminal-popup {
                background: #0a0a0a;
                border: 1px solid #1a1a1a;
                max-width: 500px;
                width: 95%;
                transform: scale(0.95);
                transition: transform 0.2s ease;
                font-family: 'Courier New', 'Lucida Console', Monaco, monospace;
            }
            .terminal-overlay.active .terminal-popup {
                transform: scale(1);
            }
            .terminal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: #111;
                border-bottom: 1px solid #1a1a1a;
            }
            .terminal-title {
                color: #444;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .terminal-controls {
                display: flex;
                gap: 6px;
            }
            .terminal-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #333;
            }
            .terminal-body {
                padding: 20px;
            }
            .terminal-ascii {
                color: #00ff41;
                font-size: 6px;
                line-height: 1.1;
                white-space: pre;
                text-align: center;
                margin-bottom: 20px;
                opacity: 0.8;
            }
            .terminal-prompt {
                color: #444;
                font-size: 11px;
                margin-bottom: 8px;
            }
            .terminal-message {
                color: #00ff41;
                font-size: 14px;
                line-height: 1.6;
                padding: 12px 0;
                border-left: 2px solid #00ff41;
                padding-left: 12px;
                margin-bottom: 20px;
            }
            .terminal-close {
                background: transparent;
                color: #444;
                border: 1px solid #222;
                padding: 8px 20px;
                font-size: 11px;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.15s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
                display: block;
                width: 100%;
            }
            .terminal-close:hover {
                border-color: #00ff41;
                color: #00ff41;
                background: rgba(0, 255, 65, 0.05);
            }
            .terminal-footer {
                padding: 8px 12px;
                background: #080808;
                border-top: 1px solid #1a1a1a;
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: #333;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            .terminal-cursor {
                display: inline-block;
                width: 8px;
                height: 14px;
                background: #00ff41;
                margin-left: 2px;
                animation: blink 1s infinite;
                vertical-align: middle;
            }
            /* Scanline effect */
            .terminal-popup::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, 0.15) 2px,
                    rgba(0, 0, 0, 0.15) 4px
                );
                pointer-events: none;
            }
            .terminal-popup {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // Cria o HTML do popup
    function criarPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'terminal-overlay';
        overlay.id = 'terminal-overlay';
        overlay.innerHTML = `
            <div class="terminal-popup">
                <div class="terminal-header">
                    <span class="terminal-title">access_denied.sh</span>
                    <div class="terminal-controls">
                        <div class="terminal-dot"></div>
                        <div class="terminal-dot"></div>
                        <div class="terminal-dot"></div>
                    </div>
                </div>
                <div class="terminal-body">
                    <pre class="terminal-ascii">${asciiArt}</pre>
                    <div class="terminal-prompt">root@fsociety:~$ ./bypass_security.sh</div>
                    <div class="terminal-message">${frase}<span class="terminal-cursor"></span></div>
                    <button class="terminal-close" id="terminal-close">[enter] continuar</button>
                </div>
                <div class="terminal-footer">
                    <span>connection: active</span>
                    <span>pid: ${Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Fecha ao clicar no botao
        document.getElementById('terminal-close').addEventListener('click', fecharPopup);

        // Fecha ao clicar fora do popup
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                fecharPopup();
            }
        });

        // Fecha com ESC ou Enter
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'Enter') {
                const overlay = document.getElementById('terminal-overlay');
                if (overlay && overlay.classList.contains('active')) {
                    fecharPopup();
                }
            }
        });
    }

    // Mostra o popup
    function mostrarPopup(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        document.getElementById('terminal-overlay').classList.add('active');
        return false;
    }

    // Fecha o popup
    function fecharPopup() {
        document.getElementById('terminal-overlay').classList.remove('active');
    }

    // Identifica e configura os elementos sem funcionalidade
    function configurarElementos() {
        // === MICROSOFT ===
        document.querySelectorAll('a[href=""], a[href="#"]').forEach(link => {
            const dentroDeIdentity = link.closest('.identity');
            const ehBotaoVoltar = link.classList.contains('back');

            if (!dentroDeIdentity && !ehBotaoVoltar) {
                link.addEventListener('click', mostrarPopup, true);
            }
        });

        // Sign-in options
        const optsElement = document.querySelector('.opts');
        if (optsElement) {
            optsElement.addEventListener('click', mostrarPopup, true);
            optsElement.style.cursor = 'pointer';
        }

        // === SPOTIFY ===
        document.querySelectorAll('.social-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', mostrarPopup, true);
        });

        const forgotLink = document.querySelector('.forgot-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', mostrarPopup, true);
        }

        const signupLink = document.querySelector('.signup-link a');
        if (signupLink) {
            signupLink.addEventListener('click', mostrarPopup, true);
        }

        // === GOOGLE ===
        document.querySelectorAll('.card a[href="#"], .card .link, .btn-text').forEach(link => {
            const ehBotaoVoltar = link.id === 'btn-back' || link.closest('#btn-back');
            if (!ehBotaoVoltar) {
                link.addEventListener('click', mostrarPopup, true);
            }
        });

        document.querySelectorAll('footer a[href="#"], .footer-right a').forEach(link => {
            link.addEventListener('click', mostrarPopup, true);
        });
    }

    // Inicializa
    function init() {
        injetarCSS();
        criarPopup();
        configurarElementos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
