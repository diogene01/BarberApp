import { formatCurrency } from "../utils/formatting.js";
import { openModal } from "../components/modal.js";

// Formulário para adicionar/editar um plano
export function showPlanForm(plan = null) {
    console.log(`Exibindo formulário de plano. Editando: ${!!plan}.`);
    const isEditing = !!plan;
    const formHTML = `<form id="plan-form" data-id="${isEditing ? plan.id : ''}"><div class="space-y-4">
        <div><label class="block text-sm font-medium">Nome do Plano</label><input type="text" name="name" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? plan.name : ''}" required></div>
        <div><label class="block text-sm font-medium">Descrição</label><textarea name="description" class="mt-1 block w-full border-gray-300 rounded-md p-2">${isEditing ? plan.description : ''}</textarea></div>
        <div><label class="block text-sm font-medium">Preço Mensal</label><input type="number" name="price" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? plan.price : ''}" required></div>
        <button type="submit" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90 bg-slate-700">${isEditing ? 'Salvar' : 'Adicionar'}</button>
    </div></form>`;
    openModal(isEditing ? 'Editar Plano' : 'Novo Plano', formHTML);
}

// Renderiza a página de Planos do barbeiro
export function renderPlansPage(container, barberData) {
    console.log("Renderizando página de planos.");
    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Planos Mensais</h2><button id="add-plan-btn" class="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center bg-slate-700"><i class="fas fa-plus mr-2"></i> Novo Plano</button></div>
            <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Nome</th><th class="p-3">Descrição</th><th class="p-3">Preço</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="full-plan-list"></tbody></table></div>
        </div>`;
    container.querySelector('#full-plan-list').innerHTML = barberData.plans.map(p => `
        <tr class="border-b hover:bg-gray-50" data-id="${p.id}">
            <td class="p-3">${p.name}</td><td class="p-3">${p.description}</td><td class="p-3">${formatCurrency(parseFloat(p.price))}</td>
            <td class="p-3 text-center"><button class="edit-plan-btn text-blue-500 hover:text-blue-700 mr-3" data-id="${p.id}"><i class="fas fa-pencil-alt"></i></button><button class="delete-plan-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
        </tr>`).join('');
}