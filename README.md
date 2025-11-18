# Página estática de cadastro (login e senha)

Uma página simples e moderna com formulário de cadastro contendo campos de email, senha e confirmação de senha. É 100% estática (HTML/CSS/JS) e não envia dados para servidor.

## Como usar

- Abra o arquivo `index.html` no navegador.
  - Windows (PowerShell):
    ```powershell
    # dentro da pasta do projeto
    start .\index.html
    ```
- Preencha os campos e clique em "Cadastrar". O envio é simulado apenas para demonstração.

## Recursos

- Validações HTML5 básicas (email, tamanho mínimo da senha).
- Confirmação de senha e destaque de campos inválidos.
- Botão para mostrar/ocultar senha.
- Layout responsivo e acessível (mensagens com `aria-live`).
- Tema adaptável a claro/escuro (via `prefers-color-scheme`).

## Personalização

- Para remover a fonte do Google, apague os links de fonte no `<head>` de `index.html`.
- Ajuste cores no início de `styles.css` (variáveis CSS como `--primary`).
- No arquivo `script.js`, adapte a validação ou acople a um backend real substituindo o `preventDefault()` e definindo `action`/`method` no `<form>`.

## Observação

Este projeto não armazena dados. Para ambiente real, conecte o formulário a uma API (HTTPS), aplique validações adicionais e políticas de senha, e não esqueça de LGPD.
