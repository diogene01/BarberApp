import { customerView, renderCustomerView } from "../pages/customers.js";
import { fetchBarberData, barberData } from "../service/searchData.js";
import { navigateTo } from "../components/navigateAndRendering.js";
import { showMessage } from "../utils/showMenssage.js";
import { closeModal } from "../components/modal.js";
import { renderServicesPage } from "../pages/services.js";
import { renderPlansPage } from "../pages/plans.js";
import { renderExpensesPage } from "../pages/expenses.js";
import { renderSettingsPage } from "../pages/settings.js";
import { renderAppointmentsPage } from "../pages/appointments.js";

const loginScreen = document.getElementById('login-screen');
const barberCodeScreen = document.getElementById('barber-code-screen');
const appWrapper = document.getElementById('app-wrapper');
const adminView = document.getElementById('admin-view');
const loginError = document.getElementById('login-error');
const barberCodeError = document.getElementById('barber-code-error');
const adminNameDisplay = document.getElementById('admin-name-display'); // NOVO: Elemento para o nome do barbeiro

const API_URL = 'http://localhost:3000';
export let LoggedInUser = null; // Armazena o usuário logado (barbeiro ou cliente)
export let clientUser = null;

// --- LÓGICA DE MANIPULAÇÃO DE DADOS (CRIAR, ATUALIZAR, DELETAR) ---
export async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Formulário submetido. Enviando dados para a API...");''
    const form = e.target;
    const id = form.dataset.id ? parseInt(form.dataset.id) : null;
    const editId = form.dataset.editId ? parseInt(form.dataset.editId) : null;
    const formData = new FormData(form);
    
    console.log(`ID do Form: ${form.id}`);

    let endpoint = '';
    let method = '';
    let data = {};



    if (form.id === 'service-form') {
        data = {
            barber_id: LoggedInUser.id,
            name: formData.get('name'),
            image_url: formData.get('image'),
            price: parseFloat(formData.get('price')),
            duration_minutes: parseInt(formData.get('duration'))
        };
        endpoint = `/services${id ? `/${id}` : ''}`;
        method = id ? 'PUT' : 'POST';
    } else if (form.id === 'plan-form') {
        data = {
            barber_id: LoggedInUser.id,
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price'))
        };
        endpoint = `/plans${id ? `/${id}` : ''}`;
        method = id ? 'PUT' : 'POST';
    } else if (form.id === 'expense-form') {
        data = {
            barber_id: LoggedInUser.id,
            description: formData.get('description'),
            value: parseFloat(formData.get('value'))
        };
        endpoint = `/expenses${id ? `/${id}` : ''}`;
        method = id ? 'PUT' : 'POST';
    } else if (form.id === 'appointment-form') {
        data = {
            barber_id: LoggedInUser.id,
            client_id: clientUser.id,
            service_id: parseInt(form.dataset.serviceId),
            date: formData.get('date'),
            time: formData.get('time'),
            status: 'Agendado'
        };
        endpoint = `/appointments${editId ? `/${editId}` : ''}`;
        method = editId ? 'PUT' : 'POST';

        if (!data.date || !data.time) {
            showMessage('Por favor, selecione data e horário.', 'error');
            return;
        }
    } else if (form.id === 'settings-form') {
        data = {
            logo_url: formData.get('logoUrl'),
            background_image_url: formData.get('backgroundImageUrl'),
            available_time_slots: (barberData.availableTimeSlots || []).join(',')

        };
        endpoint = `/settings/${LoggedInUser.id}`;
        method = 'PUT';
    }
    
    try {
        console.log(`Requisição para ${API_URL}${endpoint} com método ${method}. Dados:`, data);
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Resposta da API:', result)
        
        if (response.ok) {
            showMessage(result.message, 'success');
            closeModal();

            // Atualiza a interface com os novos dados
            if (LoggedInUser.user_type === 'barber') {
                await fetchBarberData(LoggedInUser, API_URL);

                navigateTo(document.querySelector('.nav-link.active').dataset.target);

            } else {
                await fetchBarberData(LoggedInUser, API_URL);
                renderCustomerView();
            }

            //Chama a função para atualizar a página aplicando as mudanças no Banco de Dados
            switch(form.id){
                case 'service-form' : renderServicesPage(document.getElementById("page-services"), barberData) ; break;
                case 'plan-form' : renderPlansPage(document.getElementById("page-plans"), barberData) ; break;
                case 'expense-form' : renderExpensesPage(document.getElementById("page-expenses"), barberData) ; break;
                case 'appointment-form' : renderAppointmentsPage(document.getElementById("page-appointments"), barberData) ; break;
                case 'settings-form' : renderSettingsPage(document.getElementById("page-settings"), LoggedInUser) ; break;
            }



        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        showMessage('Erro ao conectar com o servidor. Tente novamente.', 'error');
    }
}



// Lida com o processo de login para clientes e barbeiros
export async function handleLogin(e, role) {
    e.preventDefault();
    const email = document.getElementById(`${role}-email`).value;
    const password = document.getElementById(`${role}-password`).value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, userType: role })
        });
        const result = await response.json();
        
        if (response.ok) {
            loginError.classList.add('hidden');
            
            if (role === 'barber') {
                LoggedInUser = result.user;
                if (LoggedInUser.subscription_status !== 'active') { //Lógica da Assinatura
                    loginError.textContent = 'Sua assinatura está vencida. Regularize para acessar.';
                    loginError.classList.remove('hidden');
                }

                adminNameDisplay.textContent = LoggedInUser.name; // NOVO: Atualiza o nome do barbeiro

                loginScreen.classList.add('hidden');
                appWrapper.classList.remove('hidden');
                adminView.classList.remove('hidden');
                customerView.classList.add('hidden');
                // Busca todos os dados do barbeiro logado
                await fetchBarberData(LoggedInUser, API_URL);
                navigateTo('page-dashboard');
            } else {
                console.log("Login de cliente bem-sucedido. Redirecionando para a tela de código.");
                clientUser = result.user;
                console.log("Logado como cliente: ", clientUser.id);
                loginScreen.classList.add('hidden');
                barberCodeScreen.classList.remove('hidden');
            }
        } else {
            console.error("Falha no login:", result.error);
            loginError.textContent = result.error;
            loginError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erro de login:', error);
        loginError.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
        loginError.classList.remove('hidden');
    }
}


// Lida com a entrada do código da barbearia pelo cliente
export async function handleBarberCode(e) {
    e.preventDefault();
    const code = document.getElementById('barber-code-input').value;
    barberCodeError.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_URL}/barbers?code=${code}`);
        const result = await response.json();
        console.log('Resposta da API de barbeiros:', result);

        LoggedInUser = result[0];

        if (response.ok && result.length > 0) {
            barberCodeScreen.classList.add('hidden');
            appWrapper.classList.remove('hidden');
            customerView.classList.remove('hidden');
            adminView.classList.add('hidden');

            // Busca os dados do barbeiro para o cliente
            await fetchBarberData(LoggedInUser, API_URL);
            renderCustomerView();
        } else {
            barberCodeError.textContent = result.error || 'Código da barbearia inválido.';
            barberCodeError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erro ao verificar código:', error);
        barberCodeError.textContent = 'Erro ao conectar com o servidor.';
        barberCodeError.classList.remove('hidden');
    }
}


// Lida com o processo de logout
export function handleLogout() {
    console.log("Usuário deslogado.");

    // Limpa campos de login
    document.querySelectorAll('#admin-login-form input, #client-login-form input, #client-password').forEach(input => {
        input.value = '';
    });


    LoggedInUser = null;
    LoggedInUser = null;
    adminView.classList.add('hidden');
    customerView.classList.add('hidden');
    appWrapper.classList.add('hidden');
    barberCodeScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
}


// Lida com a exclusão de um item (serviço, plano, etc.)
export async function handleDelete(e, type) {
    const row = e.target.closest('tr');
    const id = parseInt(row.dataset.id);
    console.log(`Tentativa de deletar item de tipo "${type}" com ID: ${id}.`);
    
    try {
        const response = await fetch(`${API_URL}/${type}/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log('Resposta da API de deleção:', result);
        
        if (response.ok) {
            showMessage(result.message, 'success');
            await fetchBarberData(LoggedInUser, API_URL);
            navigateTo(`page-${type}`);
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error(`Erro ao deletar ${type}:`, error);
        showMessage('Erro ao conectar com o servidor.', 'error');
    }
}


// Lida com o processo de cadastro de um novo usuário
export async function handleRegister(e) {
    e.preventDefault();
    console.log("Iniciando processo de cadastro...");
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const userType = document.getElementById('user-type').value;

    // Validação de senhas
    if (password !== confirmPassword) {
        console.error("Erro: Senhas não coincidem.");
        showMessage('As senhas não coincidem.', 'error');
        return;
    }

    try {
        console.log("Enviando dados de cadastro para a API...");
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, userType })
        });
        const result = await response.json();
        console.log('Resposta da API de cadastro:', result);
        
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('login-form-container').classList.remove('hidden');
            document.getElementById('register-form-container').classList.add('hidden');
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showMessage('Erro ao conectar com o servidor.', 'error');
    }
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.reset(); // O método reset() limpa todos os inputs, selects e textareas do form
        console.log("Campos do formulário de cadastro limpos.");
    }
}