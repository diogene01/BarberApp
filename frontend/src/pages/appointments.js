import { formatDate } from "../utils/formatting.js";

// Renderiza a página de agendamentos do barbeiro
export function renderAppointmentsPage(container, barberData) {
    console.log("Renderizando agenda do barbeiro.");
    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold mb-4">Agenda de Horários</h2>
            <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Cliente</th><th class="p-3">Serviço</th><th class="p-3">Data</th><th class="p-3">Hora</th><th class="p-3">Status</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="appointment-list"></tbody></table></div>
        </div>`;
    const appointmentList = container.querySelector('#appointment-list');
    appointmentList.innerHTML = barberData.appointments.map(a => {
        const client = barberData.clients.find(c => c.id === a.client_id) || { name: 'Não encontrado' };
        const service = barberData.services.find(s => s.id === a.service_id) || { name: 'Não encontrado' };
        const statusColor = a.status === 'Confirmado' ? 'bg-green-100 text-green-800' : a.status === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
        return `<tr class="border-b hover:bg-gray-50" data-id="${a.id}">
            <td class="p-3">${client.name}</td>
            <td class="p-3">${service.name}</td>
            <td class="p-3">${formatDate(a.date)}</td>
            <td class="p-3">${a.time}</td>
            <td class="p-3"><span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor}">${a.status}</span></td>
            <td class="p-3 text-center"><button class="delete-appointment-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
        </tr>`;
    }).join('');
}

// Renderiza a página de Clientes do barbeiro
export function renderClientsPage(container, barberData) {
    console.log("Renderizando página de clientes.");
    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-2xl font-bold mb-4">Lista de Clientes</h2>
            <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Nome</th><th class="p-3">Telefone</th><th class="p-3">Email</th></tr></thead><tbody id="client-list-body"></tbody></table></div>
        </div>`;
    container.querySelector('#client-list-body').innerHTML = barberData.clients.map(c => `
        <tr class="border-b hover:bg-gray-50" data-id="${c.id}">
            <td class="p-3">${c.name}</td><td class="p-3">${c.phone}</td><td class="p-3">${c.email}</td>
        </tr>`).join('');
}