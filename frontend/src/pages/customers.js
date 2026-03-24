import { barberData } from "../service/searchData.js";
import { applyVisualChanges } from "../components/visualChanges.js";
import { LoggedInUser, clientUser } from "../handlers/handleThings.js";
import { formatCurrency, formatDate } from "../utils/formatting.js";
import { openModal } from "../components/modal.js";

export const customerView = document.getElementById('customer-view');

// Renderiza a visualização do cliente
export function renderCustomerView() {
    console.log("Renderizando a visualização do cliente.");
    customerView.innerHTML = `
        <header class="bg-white shadow-md sticky top-0 z-20"><div class="container mx-auto px-4 py-4 flex justify-between items-center"><div class="flex items-center space-x-2"><img src="${LoggedInUser?.logo_url}" class="app-logo w-10 h-10 rounded-full object-cover"><h1 class="text-xl md:text-2xl font-bold text-gray-800">${LoggedInUser?.name}</h1></div><button class="logout-btn text-sm text-red-600 hover:underline">Sair</button></div></header>
        <main class="container mx-auto p-4 md:p-8">
            <div class="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <div class="border-b border-gray-200 mb-6">
                    <nav class="-mb-px flex space-x-8" id="customer-tabs">
                        <a href="#" data-tab="schedule" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">Agendar Serviço</a>
                        <a href="#" data-tab="my-appointments" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Meus Agendamentos</a>
                        <a href="#" data-tab="plans" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">Planos Mensais</a>
                    </nav>
                </div>
                <div id="customer-tab-content">
                    <div id="schedule-content"></div>
                    <div id="my-appointments-content" class="hidden"></div>
                    <div id="plans-content" class="hidden"></div>
                </div>
            </div>
        </main>`;
    
    applyVisualChanges(LoggedInUser);
    renderCustomerTab('schedule');
}

// Renderiza o conteúdo das abas da área do cliente
export function renderCustomerTab(tabName) {
    document.querySelectorAll('#customer-tab-content > div').forEach(div => div.classList.add('hidden'));
    const contentEl = document.getElementById(`${tabName}-content`);
    contentEl.classList.remove('hidden');

    if (tabName === 'schedule') {
        contentEl.innerHTML = `
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">Nossos Serviços</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">${barberData.services.map(s => `
                <div class="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                    <img src="${s.image_url}" alt="${s.name}" class="w-full h-32 md:h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x300/cccccc/ffffff?text=Img';">
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="font-bold text-md md:text-lg mb-1">${s.name}</h3>
                        <p class="text-gray-500 text-sm mb-2">${formatCurrency(parseFloat(s.price))} - ${s.duration} min</p>
                        <div class="mt-auto"><button data-id="${s.id}" class="schedule-service-btn w-full text-white font-semibold py-2 rounded-lg hover:opacity-90 bg-blue-600">Agendar</button></div>
                    </div>
                </div>`).join('')}
            </div>`;
    } else if (tabName === 'my-appointments') {
        renderClientAppointments(contentEl);
    } else if (tabName === 'plans') {
        contentEl.innerHTML = `<h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">Conheça Nossos Planos</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">${barberData.plans.map(p => `
                <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col text-center">
                    <h3 class="text-xl font-bold text-slate-800 mb-2">${p.name}</h3>
                    <p class="text-gray-600 mb-4 flex-grow">${p.description}</p>
                    <p class="text-3xl font-bold mb-4">${formatCurrency(parseFloat(p.price))}<span class="text-lg font-normal">/mês</span></p>
                    <button class="w-full text-white font-semibold py-2 rounded-lg hover:opacity-90 bg-blue-600">Assinar Plano</button>
                </div>`).join('')}
            </div>`;
    }
    applyVisualChanges(LoggedInUser);
}

// Renderiza a lista de agendamentos do cliente
export function renderClientAppointments(container) {
    console.log("Renderizando agendamentos do cliente.");
    const clientAppointments = barberData.appointments.filter(a => a.client_id === clientUser.id);
    if (clientAppointments.length == 0) {
        container.innerHTML = `<h2 class="text-2xl font-bold mb-4">Meus Agendamentos</h2><p class="text-center text-gray-500">Você ainda não possui horários marcados.</p>`;
        return;
    }
    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Meus Agendamentos</h2>
        <div class="space-y-4">
            ${clientAppointments.map(a => {
                const service = barberData.services.find(s => s.id === a.service_id);
                return `<div class="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <div>
                        <p class="font-bold text-lg">${service.name}</p>
                        <p class="text-sm text-gray-600"><i class="fas fa-calendar-alt mr-2"></i>${formatDate(a.date)} às ${a.time}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button data-id="${a.id}" class="edit-appointment-btn text-xs text-white px-3 py-1 rounded-md hover:opacity-90 bg-blue-600">Alterar</button>
                        <button data-id="${a.id}" class="cancel-appointment-btn text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Cancelar</button>
                    </div>
                </div>`
            }).join('')}
        </div>`;
}

// Exibe o modal para agendamento ou edição
export function showSchedulingModal(service, appointmentToEdit = null) {
    const isEditing = !!appointmentToEdit;
    const timeSlots = [...barberData.availableTimeSlots].sort();
    
    const formHTML = `
        <form id="appointment-form" data-service-id="${service.id}" ${isEditing ? `data-edit-id="${appointmentToEdit.id}"` : ''} class="space-y-4">
            <p>Você está agendando: <strong class="text-blue-600">${service.name}</strong></p>
            <div>
                <label class="block text-sm font-medium mb-1">Escolha a data:</label>
                <input type="date" name="date" class="w-full border-gray-300 rounded-md p-2" value="${isEditing ? appointmentToEdit.date : ''}" required>
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Escolha o horário:</label>
                <div id="time-slots-container" class="grid grid-cols-4 gap-2">
                    <!-- Horários serão injetados aqui -->
                </div>
                <input type="hidden" name="time" id="selected-time" value="${isEditing ? appointmentToEdit.time : ''}" required>
            </div>
            <button type="submit" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90 bg-blue-600">${isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</button>
        </form>`;
    openModal(isEditing ? 'Alterar Horário' : `Agendar ${service.name}`, formHTML, 'max-w-lg');
    
    const dateInput = modal.querySelector('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    const updateSlots = (selectedDate) => {
        const timeSlotsContainer = modal.querySelector('#time-slots-container');
        const appointmentsOnDate = barberData.appointments
            .filter(a => a.date === selectedDate && (!isEditing || a.id !== appointmentToEdit.id))
            .map(a => a.time);
        
        timeSlotsContainer.innerHTML = timeSlots.map(slot => {
            const isDisabled = appointmentsOnDate.includes(slot);
            const isSelected = isEditing && appointmentToEdit.date === selectedDate && appointmentToEdit.time === slot;
            return `<div class="time-slot ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" data-time="${slot}">${slot}</div>`;
        }).join('');
        applyVisualChanges(LoggedInUser);
    };

    dateInput.addEventListener('change', (e) => {
        modal.querySelector('#selected-time').value = '';
        updateSlots(e.target.value);
    });

    if (isEditing && appointmentToEdit.date) {
        updateSlots(appointmentToEdit.date);
    }
    applyVisualChanges(LoggedInUser);
}