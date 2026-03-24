import { formatCurrency } from "../utils/formatting.js";

// Renderiza a página do Dashboard do barbeiro
export function renderDashboardPage(container, barberData) {
    console.log("Renderizando dashboard.");
    const completedAppointments = barberData.appointments.filter(a => a.status === 'Confirmado');
    const totalRevenue = completedAppointments.reduce((sum, a) => {
        const service = barberData.services.find(s => s.id === a.service_id);
        return sum + (service ? service.price : 0);
    }, 0);
    const totalExpenses = barberData.expenses.reduce((sum, e) => sum + parseFloat(e.value), 0);
    const netProfit = totalRevenue - totalExpenses;
    console.log(`Faturamento: ${totalRevenue}, Despesas: ${totalExpenses}, Lucro: ${netProfit}`);


    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Faturamento Bruto (mês)</h4><p class="text-3xl font-bold text-green-600">${formatCurrency(totalRevenue)}</p></div>
            <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Serviços Prestados (mês)</h4><p class="text-3xl font-bold text-blue-500">${completedAppointments.length}</p></div>
            <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Despesas (mês)</h4><p class="text-3xl font-bold text-red-500">${formatCurrency(totalExpenses)}</p></div>
            <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Lucro Líquido (mês)</h4><p class="text-3xl font-bold text-indigo-600">${formatCurrency(netProfit)}</p></div>
        </div>`;
}