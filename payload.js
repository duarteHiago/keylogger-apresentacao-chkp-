// Exemplo de payload JavaScript que será executado
console.log('🎯 PAYLOAD EXECUTADO!');

// Exibe alerta
alert('Código externo executado com sucesso!\n\nEste é um exemplo de como código malicioso pode ser injetado.');

// Captura mais informações
const additionalInfo = {
  battery: navigator.getBattery ? 'Suportado' : 'Não suportado',
  connection: navigator.connection ? navigator.connection.effectiveType : 'Desconhecido',
  memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Desconhecido',
  cores: navigator.hardwareConcurrency || 'Desconhecido',
  onLine: navigator.onLine ? 'Online' : 'Offline'
};

console.table(additionalInfo);

// Modifica a página
document.body.style.border = '5px solid red';
const warning = document.createElement('div');
warning.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);background:red;color:white;padding:15px 30px;border-radius:8px;z-index:9999;font-weight:bold;';
warning.textContent = '⚠️ PAYLOAD EXECUTADO - DEMONSTRAÇÃO';
document.body.appendChild(warning);

// Remove o aviso após 5 segundos
setTimeout(() => warning.remove(), 5000);
