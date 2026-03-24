import { applyVisualChanges } from "../components/visualChanges.js";

export const barberData = {
    services: [],
    plans: [],
    appointments: [],
    expenses: [],
    clients: [],
    availableTimeSlots: []
};


// Busca todos os dados de um barbeiro específico na API
export async function fetchBarberData(barber, API_URL) {
    
    // Agora você usa barber.id para montar as URLs
    console.log(`Buscando dados para o barbeiro: ${barber.name} (ID: ${barber.id})`);

    try {
        const [servicesRes, plansRes, appointmentsRes, expensesRes, clientsRes, settingsRes] = await Promise.all([
            fetch(`${API_URL}/services/${barber.id}`), // <--- Acessando o ID dentro do objeto
            fetch(`${API_URL}/plans/${barber.id}`),
            fetch(`${API_URL}/appointments/${barber.id}`),
            fetch(`${API_URL}/expenses/${barber.id}`),
            fetch(`${API_URL}/clients/${barber.id}`),
            fetch(`${API_URL}/settings/${barber.id}`)
        ]);

        barberData.services = await servicesRes.json();
        barberData.plans = await plansRes.json();
        barberData.appointments = await appointmentsRes.json();
        barberData.expenses = await expensesRes.json();
        barberData.clients = await clientsRes.json();
        const settingsData = await settingsRes.json();
        barberData.availableTimeSlots = settingsData.available_time_slots.split(',');
        
        console.log("Dados do barbeiro buscados com sucesso:", barberData);
        applyVisualChanges(barber);
    } catch (error) {
        console.error('Erro ao buscar dados do barbeiro:', error);
    }
}
