const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');

// Exibe uma caixa de mensagem temporária na tela
export function showMessage(text, type = 'success') {  
    console.log(`Exibindo mensagem: "${text}" com tipo "${type}".`);
    messageText.textContent = text;
    messageBox.classList.remove('hidden');
    messageBox.className = `fixed top-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    messageBox.classList.remove('opacity-0');
    setTimeout(() => {
        messageBox.classList.add('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 2000);
    }, 2000);
}