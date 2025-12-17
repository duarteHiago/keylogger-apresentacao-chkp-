# 🔐 Keylogger Browser-Based - Demonstração Educacional

<div align="center">

[![License:  MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)

**Sistema de demonstração de técnicas de phishing e keylogger client-side para fins educacionais**

[Sobre](#-sobre-o-projeto) •
[Templates](#-templates-de-phishing) •
[Instalação](#-instalação-rápida) •
[Segurança](#️-segurança) •
[Docs](#-documentação-técnica)

</div>

---

## ⚠️ AVISO IMPORTANTE

> **Este projeto é exclusivamente educacional.** O uso inadequado pode violar a LGPD e o Código Penal Brasileiro. 
> 
> **Use APENAS com consentimento explícito e em ambiente isolado (localhost).**

---

## 📋 Sobre o Projeto

Sistema de demonstração de **keylogger JavaScript** que captura interações em páginas web falsas (phishing) e envia automaticamente para um servidor backend.

### O que você vai aprender:

- ✅ Como keyloggers client-side capturam dados no navegador
- ✅ Técnicas de phishing com templates pixel-perfect
- ✅ Fluxo de captura e exfiltração de credenciais
- ✅ Como se defender contra estes ataques

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│  FRONTEND (JavaScript)                   │
│  • Templates:  Microsoft/Google/Spotify   │
│  • keylogger-client.js                   │
│    → Captura teclas/cliques              │
│    → Buffer inteligente (10/5s)          │
│    → Envio automático via fetch()        │
└──────────────┬──────────────────────────┘
               │
               │ POST /api/salvar-client
               │
┌──────────────▼──────────────────────────┐
│  BACKEND (Flask/Python)                  │
│  • Recebe dados capturados               │
│  • Valida e salva em JSON                │
└──────────────────────────────────────────┘
```

---

## 🎭 Templates de Phishing

O projeto inclui **3 templates pixel-perfect** de páginas de login reais.

| Template | Fidelidade | Características |
|----------|-----------|-----------------|
| **Microsoft** | 98% | 3 etapas, design oficial, animações |
| **Google** | 95% | 2 etapas, validação visual |
| **Spotify** | 97% | Dark mode, botões sociais |

---

## 🚀 Instalação Rápida

### 1. Clone e Configure

```bash
git clone https://github.com/duarteHiago/keylogger-apresentacao-chkp-.git
cd keylogger-apresentacao-chkp-

# Crie ambiente virtual
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
# source .venv/bin/activate    # Linux/Mac

# Instale dependências
cd backend
pip install -r requirements.txt
```

### 2. Inicie o Servidor

```powershell
cd backend
python server.py
```

✅ **Servidor rodando em:** `http://localhost:5000`

### 3. Abra um Template

```powershell
# Microsoft
cd ..\frontend\cadastro\templates\microsoft
start index.html

# OU Google
cd ..\frontend\cadastro\templates\google
start index.html

# OU Spotify
cd ..\frontend\cadastro\templates\spotify
start index.html
```

### 4. Teste e Observe

1. Digite credenciais fictícias na página
2. Pressione `F12` (DevTools) → aba **Console**
3. Veja os logs do keylogger em ação
4. Verifique `backend/client_logs.json` para ver dados capturados

---

## 📊 Como Funciona

```
Usuário digita → keylogger captura → buffer acumula → 
→ (10 eventos OU 5s) → POST para backend → salva em JSON
```

### Dados Capturados

```json
{
  "tipo": "keypress",
  "tecla": "a",
  "campo": "email",
  "timestamp": "2025-12-17T10:30:00.123Z",
  "url": "http://localhost/google/index.html",
  "sessionId": "session_1734480001_abc123"
}
```

---

## 🛡️ Segurança

### Cenário de Ataque Real

<div align="center">

```
1. Atacante registra domínio similar
   ❌ googIe.com (I maiúsculo)
   
2. Hospeda template idêntico + keylogger
   
3. Envia email de phishing em massa
   📧 "Sua conta será suspensa!"
   
4. Vítima digita credenciais reais
   
5. Keylogger captura TUDO em tempo real
   
6. Dados enviados ao servidor do atacante
   💀 Email + Senha comprometidos
```

</div>

### Como Se Proteger

#### Para Usuários:

| ✅ FAÇA | ❌ NÃO FAÇA |
|---------|-------------|
| Verifique sempre a URL (HTTPS + domínio correto) | Confie apenas no visual da página |
| Use gerenciador de senhas | Digite senhas manualmente em sites suspeitos |
| Habilite 2FA | Clique em links de emails urgentes |

#### Para Organizações:

- ✅ **EDR/XDR**: Harmony Endpoint, CrowdStrike, SentinelOne
- ✅ **URL Filtering**: Bloqueia domínios maliciosos
- ✅ **Zero Phishing**: Detecção de phishing zero-day
- ✅ **Treinamento**: Simulações periódicas

---

## 📂 Estrutura

```
keylogger-apresentacao-chkp-/
│
├── frontend/cadastro/
│   ├── keylogger-client.js      # ⚡ Keylogger JavaScript
│   └── templates/
│       ├── microsoft/           # ✅ Template Microsoft
│       ├── google/              # ✅ Template Google
│       └── spotify/             # ✅ Template Spotify
│
└── backend/
    ├── server.py                # 🖥️ API Flask
    ├── requirements.txt         # Dependências
    └── client_logs.json         # 📝 Logs (gerado)
```

---

## 🔌 API

```http
POST /api/salvar-client
Content-Type: application/json

{
  "sessao": "session_xxx",
  "dados": [ /* eventos capturados */ ],
  "navegador": "Mozilla/5.0...",
  "plataforma": "Win32",
  "idioma": "pt-BR"
}
```

**Response:**
```json
{
  "success": true,
  "eventos_recebidos": 10,
  "message": "Dados salvos com sucesso"
}
```

---

## ⚖️ Aspectos Legais

### 🇧🇷 LGPD + Código Penal

**Uso sem consentimento é:**
- ⚖️ **ILEGAL** (LGPD Art. 52)
- ⚖️ **CRIME** (Código Penal Art. 154-A)
- 💰 Multa até **R$ 50 milhões**
- 🚔 Prisão de **3 meses a 1 ano**

### ✅ Uso Educacional Legítimo

```
✅ Consentimento documentado (TCLE)
✅ Ambiente isolado (localhost)
✅ Dados fictícios/anonimizados
✅ Exclusão após demonstração
✅ Supervisão acadêmica/institucional
```

---

## 🎓 Propósito

Este projeto é para:
- 🎯 Demonstração em laboratórios de segurança
- 🔍 Treinamento de awareness em empresas
- 📖 Material didático para cibersegurança
- 🛡️ Capacitação de Blue Team e Red Team

---

## 📚 Documentação Técnica

Detalhes aprofundados sobre arquitetura, fluxos, estruturas de dados e extensões:

📖 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🛠️ Solução de Problemas

```powershell
# Erro: "No module named 'flask'"
cd backend
pip install -r requirements.txt

# Erro: "Porta 5000 em uso"
netstat -ano | findstr :5000
taskkill /PID <numero> /F

# Keylogger não envia dados
# → Verifique se servidor Flask está rodando
# → Abra DevTools (F12) e procure erros no Console
```

---

## 📄 Licença

MIT License - Veja [LICENSE](LICENSE) para detalhes.

---

## ⚠️ Disclaimer

**IMPORTANTE:** Este software é fornecido "como está", sem garantias.

O uso para capturar dados **sem consentimento explícito** é **ILEGAL** e pode resultar em:
- Processos criminais (Art. 154-A)
- Multas da LGPD (até R$ 50 milhões)
- Responsabilização civil

**Os autores NÃO se responsabilizam por uso inadequado.**

**Use responsavelmente. Sempre obtenha consentimento explícito.**

---

<div align="center">

**Desenvolvido para fins educacionais** 🎓 | **Segurança da Informação** 🔐

[![GitHub](https://img.shields.io/badge/GitHub-duarteHiago-blue?logo=github)](https://github.com/duarteHiago/keylogger-apresentacao-chkp-)

</div>
