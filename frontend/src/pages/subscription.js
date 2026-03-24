import { formatDate } from "../utils/formatting.js";

// Renderiza a página de Assinatura do barbeiro
export function renderSubscriptionPage(container, loggedInUser) {
    console.log("Renderizando página de assinatura.");
    const { subscription_status: status, subscription_due_date: dueDate } = loggedInUser;
    const isVencida = status !== 'active';
    const statusClass = isVencida ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800';
    const statusText = isVencida ? 'Vencida' : 'Ativa';

    container.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Minha Assinatura</h2>
            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 border rounded-lg">
                    <span class="font-medium">Status da Conta:</span>
                    <span class="font-semibold px-3 py-1 rounded-full ${statusClass}">${statusText}</span>
                </div>
                <div class="flex justify-between items-center p-4 border rounded-lg">
                    <span class="font-medium">Próximo Vencimento:</span>
                    <span class="font-semibold">${formatDate(dueDate)}</span>
                </div>
            </div>
            ${isVencida ? `<div class="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <h3 class="font-bold">Pagamento Pendente</h3>
                <p>Sua assinatura venceu. Para continuar usando o sistema, por favor, regularize o pagamento.</p>
                </div><button id="renew-subscription-btn" class="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Pagar com Pix e Reativar</button>`
                : `<div class="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                    <h3 class="font-bold">Tudo Certo!</h3>
                    <p>Sua assinatura está em dia.</p>
                </div>`}
        </div>`;
}