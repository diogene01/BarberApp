import { barberData } from "../service/searchData.js";

// Renderiza a página de Configurações do barbeiro
export function renderSettingsPage(container, activeBarber) {
        console.log("Renderizando página de configurações.");
        console.log("Dados Recebidos: ",activeBarber);
        container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold mb-6">Configurações da Barbearia</h2>
            <div id="settings-form" class="space-y-6">
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold mb-2">Logotipo</h3>
                    <div class="flex items-center space-x-4 mb-2">
                        <img src="${activeBarber.logo_url}" class="app-logo w-20 h-20 rounded-lg object-cover bg-gray-200">
                        <div class="w-full">
                            <label for="logo-url" class="block text-sm font-medium">URL do Logo:</label>
                            <input type="text" id="logo-url" name="logoUrl" value="${activeBarber.logo_url}" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        </div>
                    </div>
                </div>
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold mb-2">Plano de Fundo (Cliente)</h3>
                    <div class="flex items-center space-x-4 mb-2">
                        <div class="w-full">
                            <label for="background-url" class="block text-sm font-medium">URL da Imagem de Fundo:</label>
                            <input type="text" id="background-url" name="backgroundImageUrl" value="${activeBarber.background_image_url}" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        </div>
                    </div>
                </div>
                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold mb-2">Horários de Atendimento</h3>
                    <p class="text-sm text-gray-500 mb-4">Adicione ou remova os horários disponíveis para agendamento.</p>
                    <div class="flex items-center space-x-2 mb-4">
                        <input type="time" id="new-time-slot" class="block w-full border border-gray-300 rounded-md p-2">
                        <button type="button" id="add-time-slot-btn" class="text-white px-4 py-2 rounded-lg hover:opacity-90 whitespace-nowrap bg-slate-700">Adicionar</button>
                    </div>
                    <div id="time-slots-list" class="flex flex-wrap gap-2">
                    </div>
                </div>
                <div class="border-t pt-6 flex justify-between items-center">
                    <button type="button" id="reset-data-btn" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Resetar Dados</button>
                    <button type="button" id="save-settings-btn" class="text-white px-6 py-2 rounded-lg hover:opacity-90 bg-slate-700">Salvar Alterações</button>
                </div>
            </div>
        </div>`;
    
    const timeSlotsList = container.querySelector('#time-slots-list');
    const sortedSlots = [...barberData.availableTimeSlots].sort();
    timeSlotsList.innerHTML = sortedSlots.map(slot => `
        <div class="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
            <span>${slot}</span>
            <button type="button" class="delete-time-slot-btn ml-2 text-red-500 hover:text-red-700" data-time="${slot}">&times;</button>
        </div>
    `).join('');
}