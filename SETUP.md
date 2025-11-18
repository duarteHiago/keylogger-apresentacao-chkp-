# Servidor Backend para Execução de Scripts

Este projeto executa o keylogger.py quando o botão na página web é clicado.

## Instalação

1. Instale as dependências:
```powershell
python -m pip install -r requirements.txt
```

## Como usar

### Passo 1: Iniciar o servidor

```powershell
python server.py
```

Você verá:
```
🚀 Servidor iniciado em http://localhost:5000
⚠️  AVISO: Este servidor executa o keylogger.py
📌 Endpoints disponíveis:
   POST /api/execute - Inicia o keylogger
   POST /api/stop    - Para o keylogger
   GET  /api/status  - Status do keylogger
   GET  /api/log     - Conteúdo capturado
```

### Passo 2: Abrir a página web

Em outro terminal (ou clique duas vezes no arquivo):
```powershell
start .\download.html
```

### Passo 3: Clicar no botão "Baixar Agora"

- O botão enviará uma requisição para o servidor
- O servidor executará `keylogger.py` em background
- A página mostrará: "✅ Keylogger iniciado! PID: XXXX"
- O keylogger começará a capturar teclas

### Passo 4: Ver os dados capturados

As teclas capturadas são salvas em `captured_keys.txt`.

Para ver em tempo real:
```powershell
Get-Content .\captured_keys.txt -Wait
```

Ou acesse via API:
```powershell
curl http://localhost:5000/api/log
```

### Passo 5: Parar o keylogger

Pressione **ESC** no teclado (o keylogger detecta e para)

Ou via API:
```powershell
curl -X POST http://localhost:5000/api/stop
```

## APIs disponíveis

### Iniciar keylogger
```bash
POST http://localhost:5000/api/execute
```

### Parar keylogger
```bash
POST http://localhost:5000/api/stop
```

### Verificar status
```bash
GET http://localhost:5000/api/status
```

### Ver log capturado
```bash
GET http://localhost:5000/api/log
```

## Fluxo completo

1. Usuário acessa `download.html`
2. Usuário clica em "Baixar Agora"
3. JavaScript envia POST para `/api/execute`
4. Servidor Flask executa `keylogger.py` em background
5. Keylogger captura teclas e salva em `captured_keys.txt`
6. Usuário pressiona ESC para parar
7. Dados ficam salvos no arquivo de log

## Arquivos do projeto

- `server.py` - Servidor Flask que executa scripts
- `keylogger.py` - Script de captura de teclas
- `download.html` - Página com botão de download
- `download-script.js` - JavaScript que chama a API
- `download-styles.css` - Estilos da página
- `captured_keys.txt` - Log de teclas capturadas (gerado automaticamente)
- `requirements.txt` - Dependências Python

## ⚠️ Avisos importantes

- **Apenas para fins educacionais**
- Execute apenas em ambiente controlado
- Obtenha consentimento antes de monitorar
- Respeite a privacidade e legislação (LGPD)
- Não use para fins maliciosos

## Solução de problemas

### Erro: "Servidor não está rodando"
```powershell
# Inicie o servidor primeiro
python server.py
```

### Erro: "No module named 'flask'"
```powershell
# Instale as dependências
python -m pip install -r requirements.txt
```

### Erro: "Port 5000 already in use"
```powershell
# Pare o processo usando a porta 5000 ou mude a porta no server.py (linha final)
```

### Keylogger não está capturando
- Verifique se o servidor está rodando
- Veja o console do navegador (F12) para erros
- Verifique se `pynput` está instalado
- Execute o keylogger manualmente para testar: `python keylogger.py`
