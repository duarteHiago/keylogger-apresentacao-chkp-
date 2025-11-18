(function(){
  const form = document.getElementById('form-cadastro');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const confirmar = document.getElementById('confirmar');
  const feedback = document.querySelector('.feedback');

  // Alternar exibição da senha
  document.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? 'Ocultar' : 'Mostrar';
      btn.setAttribute('aria-label', (isPassword ? 'Ocultar' : 'Mostrar') + ' senha');
      input.focus();
    });
  });

  function setInvalid(input, invalid){
    input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  }

  function clearFeedback(){
    feedback.hidden = true;
    feedback.textContent = '';
    feedback.classList.remove('success', 'error');
  }

  function showFeedback(msg, ok){
    feedback.hidden = false;
    feedback.textContent = msg;
    feedback.classList.toggle('success', !!ok);
    feedback.classList.toggle('error', !ok);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFeedback();

    let valid = true;

    // Validações simples
    if (!email.value || !email.checkValidity()) {
      setInvalid(email, true);
      valid = false;
    } else {
      setInvalid(email, false);
    }

    if (!senha.value || senha.value.length < 6) {
      setInvalid(senha, true);
      valid = false;
    } else {
      setInvalid(senha, false);
    }

    if (!confirmar.value || confirmar.value !== senha.value) {
      setInvalid(confirmar, true);
      valid = false;
    } else {
      setInvalid(confirmar, false);
    }

    if (!valid) {
      showFeedback('Confira os dados: verifique o email e se as senhas coincidem.', false);
      return;
    }

    // Simula envio (página é estática)
    showFeedback('Cadastro realizado com sucesso! (Simulação)', true);

    // Opcional: limpar formulário após alguns segundos
    setTimeout(() => {
      form.reset();
      document.querySelectorAll('.toggle').forEach(b => b.textContent = 'Mostrar');
    }, 1500);
  });
})();
