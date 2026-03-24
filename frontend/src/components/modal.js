import { handleFormSubmit } from "../handlers/handleThings.js";

export const modal = document.getElementById('modal');
export const modalTitle = document.getElementById('modal-title');
export const modalBody = document.getElementById('modal-body');
export const modalCloseBtn = document.getElementById('modal-close-btn');


// --- LÓGICA DO MODAL ---
export function openModal(title, formHTML, size = 'max-w-md') { 
    console.log(`Abrindo modal com título: "${title}".`);
    modalTitle.textContent = title; 
    modalBody.innerHTML = formHTML; 
    modal.querySelector('div').className = `bg-white rounded-lg shadow-2xl w-full ${size}`; 
    modal.classList.remove('hidden'); 
    modal.classList.add('flex'); 
}

export function closeModal() { 
    console.log("Fechando modal.");
    modal.classList.add('hidden'); 
    modal.classList.remove('flex'); 
    modalBody.innerHTML = ''; 
}

export function startModal(){
    // Botões de Modais e Formulários
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modalBody.addEventListener('submit', handleFormSubmit);
}
