# Sistema de Demonstração: Cadastro + Download + Execução Controlada

Este projeto demonstra, em ambiente local e com consentimento, como uma página web pode:
- Exibir um formulário de cadastro estático (sem backend ativo por padrão)
- Oferecer uma página de download com um botão que dispara ações no cliente e no servidor
- Chamar um servidor local (Flask) que executa um script Python em background

⚠️ Importante: Este repositório é para fins educacionais/demonstração. O script `keylogger.py` captura teclas localmente. Use APENAS em ambiente controlado, com consentimento explícito, em conformidade com leis e políticas (LGPD). Não utilize para fins maliciosos.

---

## Estrutura do projeto

```
frontend/
  cadastro/
    index.html
    styles.css
    script.js
  download/
    download.html
    download-styles.css
    download-script.js
    examples/
      payload.js  (não utilizado; exemplo educacional)

backend/
  server.py
  keylogger.py
  requirements.txt

captured_keys.txt  (gerado quando o keylogger roda, dentro de backend/)
```

Fluxo (alto nível):
```
Usuário → frontend/download/download.html → (botão) → download-script.js → POST /api/execute → backend/server.py → executa backend/keylogger.py
                                                                                   ↓
                                                                  backend/captured_keys.txt (log)
```

---

## Requisitos

- Windows (PowerShell)
- Python 3.11 ou 3.12 recomendado (3.13 pode requerer ajustes de pacotes)

Pacotes (instalados via `backend/requirements.txt`): Flask, Flask-CORS, pynput

---

## Instalação

Recomendado usar ambiente virtual.

```powershell
# na raiz do projeto
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip

# instalar dependências do backend
cd .\backend
python -m pip install -r requirements.txt
cd ..
```

---

## Execução

1) Inicie o servidor Flask (na pasta backend)
```powershell
cd .\backend
python server.py
```
Saída esperada (resumo):
```
🚀 Servidor iniciado em http://localhost:5000
📌 Endpoints: /api/execute, /api/stop, /api/status, /api/log
```

2) Abra a página de download e clique no botão (na pasta frontend)
```powershell
cd ..\frontend\download
start .\download.html
```
- A página chamará `POST http://localhost:5000/api/execute`
- O servidor executa `backend/keylogger.py` em background
- A página exibirá “Keylogger iniciado! PID: ...” e fará download de um relatório simples

3) Visualize o log de capturas em tempo real (na pasta backend)
```powershell
cd ..\..\backend
Get-Content .\captured_keys.txt -Wait
```

4) Parar o keylogger
- Pressione ESC no teclado (o script trata essa tecla e finaliza)
- Ou via API (outro terminal):
```powershell
curl -X POST http://localhost:5000/api/stop
```

---

## Endpoints do servidor (backend/server.py)

- `POST /api/execute`
  - Inicia `keylogger.py` em background
  - Resposta: `{ success, pid, script, message }`
- `POST /api/stop`
  - Para o processo em execução
  - Resposta: `{ success, message }`
- `GET /api/status`
  - Verifica se está rodando e retorna o PID
  - Resposta: `{ running, pid, script }`
- `GET /api/log`
  - Retorna o conteúdo atual do arquivo de log
  - Resposta: `{ success, content, size }`

---

## Páginas front-end

- `frontend/cadastro/index.html` — formulário de cadastro (estático)
- `frontend/download/download.html` — página com o botão de download/execução
  - `download-script.js` (cliente):
    - Coleta informações básicas (timestamp, userAgent, plataforma, idioma, resolução)
    - Chama o backend para iniciar o script
    - Exibe status e baixa um relatório com informações básicas + PID do processo

---

## Segurança e responsabilidade

- Uso exclusivamente educacional, com consentimento explícito e em ambiente controlado.
- Não publique estes artefatos em produção.
- Garanta transparência e compliance com a LGPD.
- Não colete/transmita dados sensíveis sem base legal e proteção adequada.

---

## Personalizações

- Alterar porta do servidor: edite `app.run(..., port=5000)` no `backend/server.py`.
- Ajustar estilos/branding: edite os CSS em `frontend/`.
- Simplificar relatório: edite a montagem do texto em `frontend/download/download-script.js`.
- Integrar com o formulário: `frontend/cadastro/index.html` pode redirecionar para `../download/download.html?from=cadastro`.

---

## Solução de problemas

- "No module named 'flask'" / "flask_cors":
```powershell
cd .\backend
python -m pip install -r requirements.txt
```

- Porta 5000 ocupada:
  - Feche o processo na porta ou altere a porta no `backend/server.py`.

- CORS/bloqueio de requisição:
  - O `Flask-CORS` está habilitado. Confirme que acessa `http://localhost:5000`.

- `pynput` em Python 3.13:
  - Se houver erro, prefira Python 3.12/3.11 em um `venv`.

- Log não aparece:
  - Verifique se o servidor iniciou o `keylogger.py` (veja PID no relatório)
  - Confira `backend/captured_keys.txt`

---

## Aviso final

Este projeto existe para conscientização e demonstração controlada. Utilize com responsabilidade, transparência e consentimento, respeitando as leis e políticas vigentes.
