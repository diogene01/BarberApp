import { formatCurrency, formatDate } from "../../utils/formatting.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const loginScreen = document.getElementById('login-screen');
    const appWrapper = document.getElementById('app-wrapper');
    const adminView = document.getElementById('admin-view');
    const customerView = document.getElementById('customer-view');
    const loginError = document.getElementById('login-error');
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentPages = document.querySelectorAll('.page-content');
    const pageTitleEl = document.getElementById('page-title');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');

    // --- DADOS (BANCO DE DADOS EM MEMÓRIA) ---
    let data = {};

    // --- FUNÇÃO PARA SALVAR E CARREGAR DADOS ---
    function saveData() {
        localStorage.setItem('barberAppData', JSON.stringify(data));
    }

    function loadData() {
        const savedData = localStorage.getItem('barberAppData');
        if (savedData) {
            data = JSON.parse(savedData);
        } else {
            // Dados padrão se não houver nada salvo
            data = {
                admin: {
                    subscription: { status: 'active', dueDate: '2025-09-18' }
                },
                services: [
                    { id: 1, name: 'Corte Social', price: 40.00, duration: 30, image: 'https://placehold.co/300x300/64748B/ffffff?text=Corte' },
                    { id: 2, name: 'Barba Terapia', price: 35.00, duration: 30, image: 'https://placehold.co/300x300/71717A/ffffff?text=Barba' },
                    { id: 3, name: 'Sobrancelha', price: 20.00, duration: 15, image: 'https://placehold.co/300x300/475569/ffffff?text=Sobrancelha' },
                    { id: 4, name: 'Combo (Corte + Barba)', price: 70.00, duration: 60, image: 'https://placehold.co/300x300/334155/ffffff?text=Combo' },
                ],
                plans: [
                    { id: 1, name: 'Plano Fiel', price: 120.00, description: '2 Cortes + 2 Barbas por mês.' },
                    { id: 2, name: 'Plano Completo', price: 150.00, description: 'Tudo ilimitado (Corte, Barba, Sobrancelha).' }
                ],
                appointments: [
                    { id: 1, clientId: 1, serviceId: 4, date: '2025-08-19', time: '10:00', status: 'Confirmado' },
                    { id: 2, clientId: 2, serviceId: 1, date: '2025-08-19', time: '14:30', status: 'Agendado' }
                ],
                expenses: [
                    { id: 1, description: 'Aluguel', value: 800.00 },
                    { id: 2, description: 'Produtos (cera, etc)', value: 250.00 }
                ],
                clients: [
                    { id: 1, name: 'Carlos Silva', phone: '(11) 98765-4321', email: 'cliente@email.com' },
                    { id: 2, name: 'João Pereira', phone: '(21) 99887-6543', email: 'joao@email.com' }
                ],
                settings: {
                    primaryColor: '#334155', // slate-700
                    logoUrl: 'https://placehold.co/100x100/334155/FFFFFF?text=Logo',
                    backgroundImageUrl: 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop'
                },
                availableTimeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
            };
        }
    }

    function showMessage(text, type = 'success') {
        messageText.textContent = text;
        messageBox.className = `fixed top-5 right-5 text-white py-3 px-5 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
        
        // 1. Garante que a div está visível no layout para a animação funcionar
        messageBox.classList.remove('hidden');
        // 2. Força um "reflow" para o navegador registrar a mudança de display antes da opacidade.
        // Um pequeno truque para garantir que a transição de fade-in aconteça.
        void messageBox.offsetWidth; 
        messageBox.classList.remove('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('opacity-0');

            // 5. DEPOIS que a animação terminar (300ms), esconde a div completamente.
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 300); // <-- Tempo igual ao da sua transição (duration-300)

        }, 2000);
    }

    function applyVisualChanges() {
        const color = data.settings.primaryColor;
        const logo = data.settings.logoUrl;
        const bgImage = data.settings.backgroundImageUrl;

        document.querySelectorAll('[data-style="primary-bg"]').forEach(el => el.style.backgroundColor = color);
        document.querySelectorAll('[data-style="primary-text"]').forEach(el => el.style.color = color);
        document.querySelectorAll('.app-logo').forEach(el => el.src = logo);

        document.querySelectorAll('.schedule-service-btn, .edit-appointment-btn').forEach(el => el.style.backgroundColor = color);
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.style.backgroundColor = color;
            el.style.borderColor = color;
        });

        customerView.style.backgroundImage = `url(${bgImage})`;
    }

    // --- LÓGICA DE LOGIN/LOGOUT ---
    function handleLogin(role) {
        const email = document.getElementById(`${role}-email`).value;
        const password = document.getElementById(`${role}-password`).value;
        
        if (role === 'admin' && email === 'admin@barber.com' && password === '1234') {
            if (data.admin.subscription.status !== 'active') {
                loginError.textContent = 'Sua assinatura está vencida. Regularize para acessar.';
                loginError.classList.remove('hidden');
                return;
            }
        }
        
        if ((role === 'admin' && email === 'admin@barber.com' && password === '1234') ||
            (role === 'client' && email === 'cliente@email.com' && password === '1234')) {
            
            loginScreen.classList.add('hidden');
            appWrapper.classList.remove('hidden');

            if (role === 'admin') {
                adminView.classList.remove('hidden');
                customerView.classList.add('hidden');
                navigateTo('page-dashboard');
            } else {
                adminView.classList.add('hidden');
                customerView.classList.remove('hidden');
                renderCustomerView();
            }
            loginError.classList.add('hidden');
        } else {
            loginError.textContent = 'Email ou senha incorretos.';
            loginError.classList.remove('hidden');
        }
    }

    function handleLogout() {
        adminView.classList.add('hidden');
        customerView.classList.add('hidden');
        appWrapper.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    }

    // --- LÓGICA DE NAVEGAÇÃO ADMIN ---
    function navigateTo(targetPageId) {
        sidebarNav.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === targetPageId);
        });
        contentPages.forEach(page => {
            page.classList.toggle('hidden', page.id !== targetPageId);
        });
        const activeLink = sidebarNav.querySelector(`[data-target=${targetPageId}]`);
        pageTitleEl.textContent = activeLink.textContent.trim();
        renderPageContent(targetPageId);
    }

    function renderPageContent(pageId) {
        const pageContainer = document.getElementById(pageId);
        if (!pageContainer) return;
        switch (pageId) {
            case 'page-dashboard': renderDashboardPage(pageContainer); break;
            case 'page-appointments': renderAppointmentsPage(pageContainer); break;
            case 'page-services': renderServicesPage(pageContainer); break;
            case 'page-plans': renderPlansPage(pageContainer); break;
            case 'page-clients': renderClientsPage(pageContainer); break;
            case 'page-expenses': renderExpensesPage(pageContainer); break;
            case 'page-subscription': renderSubscriptionPage(pageContainer); break;
            case 'page-settings': renderSettingsPage(pageContainer); break;
        }
        applyVisualChanges(); // Garante que a cor seja aplicada ao mudar de página
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO DAS PÁGINAS ADMIN ---
    function renderDashboardPage(container) {
        const completedAppointments = data.appointments.filter(a => a.status === 'Confirmado');
        const totalRevenue = completedAppointments.reduce((sum, a) => {
            const service = data.services.find(s => s.id === a.serviceId);
            return sum + (service ? service.price : 0);
        }, 0);
        const totalExpenses = data.expenses.reduce((sum, e) => sum + e.value, 0);
        const netProfit = totalRevenue - totalExpenses;

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Faturamento Bruto (mês)</h4><p class="text-3xl font-bold text-green-600">${formatCurrency(totalRevenue)}</p></div>
                <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Serviços Prestados (mês)</h4><p class="text-3xl font-bold text-blue-500">${completedAppointments.length}</p></div>
                <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Despesas (mês)</h4><p class="text-3xl font-bold text-red-500">${formatCurrency(totalExpenses)}</p></div>
                <div class="stat-card bg-white p-6 rounded-lg shadow-sm"><h4 class="text-sm font-medium text-gray-500">Lucro Líquido (mês)</h4><p class="text-3xl font-bold text-indigo-600">${formatCurrency(netProfit)}</p></div>
            </div>`;
    }

    function renderAppointmentsPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h2 class="text-2xl font-bold mb-4">Agenda de Horários</h2>
                <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Cliente</th><th class="p-3">Serviço</th><th class="p-3">Data</th><th class="p-3">Hora</th><th class="p-3">Status</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="appointment-list"></tbody></table></div>
            </div>`;
        const appointmentList = container.querySelector('#appointment-list');
        appointmentList.innerHTML = data.appointments.map(a => {
            const client = data.clients.find(c => c.id === a.clientId) || { name: 'Não encontrado' };
            const service = data.services.find(s => s.id === a.serviceId) || { name: 'Não encontrado' };
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

    function renderServicesPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Gestão de Serviços</h2><button id="add-service-btn" data-style="primary-bg" class="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center"><i class="fas fa-plus mr-2"></i> Adicionar Serviço</button></div>
                <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Foto</th><th class="p-3">Serviço</th><th class="p-3">Preço</th><th class="p-3">Duração (min)</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="full-service-list"></tbody></table></div>
            </div>`;
        container.querySelector('#full-service-list').innerHTML = data.services.map(s => `
            <tr class="border-b hover:bg-gray-50" data-id="${s.id}">
                <td class="p-2"><img src="${s.image}" alt="${s.name}" class="w-12 h-12 rounded-md object-cover" onerror="this.onerror=null;this.src='https://placehold.co/100x100/cccccc/ffffff?text=Img';"></td>
                <td class="p-3">${s.name}</td><td class="p-3">${formatCurrency(s.price)}</td><td class="p-3">${s.duration} min</td>
                <td class="p-3 text-center"><button class="edit-service-btn text-blue-500 hover:text-blue-700 mr-3"><i class="fas fa-pencil-alt"></i></button><button class="delete-service-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
            </tr>`).join('');
    }

    function renderPlansPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Planos Mensais</h2><button id="add-plan-btn" data-style="primary-bg" class="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center"><i class="fas fa-plus mr-2"></i> Novo Plano</button></div>
                <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Nome</th><th class="p-3">Descrição</th><th class="p-3">Preço</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="full-plan-list"></tbody></table></div>
            </div>`;
        container.querySelector('#full-plan-list').innerHTML = data.plans.map(p => `
            <tr class="border-b hover:bg-gray-50" data-id="${p.id}">
                <td class="p-3">${p.name}</td><td class="p-3">${p.description}</td><td class="p-3">${formatCurrency(p.price)}</td>
                <td class="p-3 text-center"><button class="edit-plan-btn text-blue-500 hover:text-blue-700 mr-3"><i class="fas fa-pencil-alt"></i></button><button class="delete-plan-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
            </tr>`).join('');
    }

    function renderClientsPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h2 class="text-2xl font-bold mb-4">Lista de Clientes</h2>
                <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Nome</th><th class="p-3">Telefone</th><th class="p-3">Email</th></tr></thead><tbody id="client-list-body"></tbody></table></div>
            </div>`;
        container.querySelector('#client-list-body').innerHTML = data.clients.map(c => `
            <tr class="border-b hover:bg-gray-50" data-id="${c.id}">
                <td class="p-3">${c.name}</td><td class="p-3">${c.phone}</td><td class="p-3">${c.email}</td>
            </tr>`).join('');
    }

    function renderExpensesPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Gestão de Despesas</h2><button id="add-expense-btn" data-style="primary-bg" class="text-white px-4 py-2 rounded-lg hover:opacity-90 flex items-center"><i class="fas fa-plus mr-2"></i> Nova Despesa</button></div>
                <div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="border-b bg-gray-50"><th class="p-3">Descrição</th><th class="p-3">Valor</th><th class="p-3 text-center">Ações</th></tr></thead><tbody id="full-expense-list"></tbody></table></div>
            </div>`;
        container.querySelector('#full-expense-list').innerHTML = data.expenses.map(e => `
            <tr class="border-b hover:bg-gray-50" data-id="${e.id}">
                <td class="p-3">${e.description}</td><td class="p-3">${formatCurrency(e.value)}</td>
                <td class="p-3 text-center"><button class="edit-expense-btn text-blue-500 hover:text-blue-700 mr-3"><i class="fas fa-pencil-alt"></i></button><button class="delete-expense-btn text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button></td>
            </tr>`).join('');
    }

    function renderSubscriptionPage(container) {
        const { status, dueDate } = data.admin.subscription;
        const isVencida = status === 'vencida';
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
                ${isVencida ? `<div class="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"><h3 class="font-bold">Pagamento Pendente</h3><p>Sua assinatura venceu. Para continuar usando o sistema, por favor, regularize o pagamento.</p></div><button id="renew-subscription-btn" class="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Pagar com Pix e Reativar</button>` : `<div class="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700"><h3 class="font-bold">Tudo Certo!</h3><p>Sua assinatura está em dia.</p></div>`}
            </div>`;
    }

    function renderSettingsPage(container) {
        container.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h2 class="text-2xl font-bold mb-6">Configurações da Barbearia</h2>
                <div id="settings-form" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-2">Aparência</h3>
                        <div class="flex items-center space-x-4">
                            <label for="color-picker" class="font-medium">Cor Principal:</label>
                            <input type="color" id="color-picker" name="primaryColor" value="${data.settings.primaryColor}" class="h-10 w-10 rounded-md">
                        </div>
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold mb-2">Logotipo</h3>
                        <div class="flex items-center space-x-4 mb-2">
                            <img src="${data.settings.logoUrl}" class="app-logo w-20 h-20 rounded-lg object-cover bg-gray-200">
                            <div class="w-full">
                                <label for="logo-url" class="block text-sm font-medium">URL do Logo:</label>
                                <input type="text" id="logo-url" name="logoUrl" value="${data.settings.logoUrl}" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                        </div>
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold mb-2">Plano de Fundo (Cliente)</h3>
                        <div class="flex items-center space-x-4 mb-2">
                            <div class="w-full">
                                <label for="background-url" class="block text-sm font-medium">URL da Imagem de Fundo:</label>
                                <input type="text" id="background-url" name="backgroundImageUrl" value="${data.settings.backgroundImageUrl}" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            </div>
                        </div>
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold mb-2">Horários de Atendimento</h3>
                        <p class="text-sm text-gray-500 mb-4">Adicione ou remova os horários disponíveis para agendamento.</p>
                        <div class="flex items-center space-x-2 mb-4">
                            <input type="time" id="new-time-slot" class="block w-full border border-gray-300 rounded-md p-2">
                            <button type="button" id="add-time-slot-btn" data-style="primary-bg" class="text-white px-4 py-2 rounded-lg hover:opacity-90 whitespace-nowrap">Adicionar</button>
                        </div>
                        <div id="time-slots-list" class="flex flex-wrap gap-2">
                            <!-- Horários serão injetados aqui -->
                        </div>
                    </div>
                    <div class="border-t pt-6 flex justify-between items-center">
                        <button type="button" id="reset-data-btn" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Resetar Dados</button>
                        <button type="button" id="save-settings-btn" data-style="primary-bg" class="text-white px-6 py-2 rounded-lg hover:opacity-90">Salvar Alterações</button>
                    </div>
                </div>
            </div>`;
        
        const timeSlotsList = container.querySelector('#time-slots-list');
        const sortedSlots = [...data.availableTimeSlots].sort();
        timeSlotsList.innerHTML = sortedSlots.map(slot => `
            <div class="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                <span>${slot}</span>
                <button type="button" class="delete-time-slot-btn ml-2 text-red-500 hover:text-red-700" data-time="${slot}">&times;</button>
            </div>
        `).join('');
    }

    // --- LÓGICA DO MODAL ---
    function openModal(title, formHTML, size = 'max-w-md') { 
        modalTitle.textContent = title; 
        modalBody.innerHTML = formHTML; 
        modal.querySelector('div').className = `bg-white rounded-lg shadow-2xl w-full ${size}`; 
        modal.classList.remove('hidden'); 
        modal.classList.add('flex'); 
    }
    function closeModal() { 
        modal.classList.add('hidden'); 
        modal.classList.remove('flex'); 
        modalBody.innerHTML = ''; 
    }

    function showConfirmationModal(message, onConfirm) {
        const modalHTML = `
            <p class="text-center mb-6">${message}</p>
            <div class="flex justify-end space-x-4">
                <button id="confirm-cancel-btn" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Voltar</button>
                <button id="confirm-action-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirmar</button>
            </div>
        `;
        openModal('Confirmação', modalHTML, 'max-w-sm');

        document.getElementById('confirm-action-btn').onclick = () => {
            onConfirm();
            closeModal();
        };
        document.getElementById('confirm-cancel-btn').onclick = closeModal;
    }

    // --- LÓGICA DOS FORMULÁRIOS ---
    function showServiceForm(service = null) {
        const isEditing = !!service;
        const formHTML = `<form id="service-form" data-id="${isEditing ? service.id : ''}"><div class="space-y-4">
            <div><label class="block text-sm font-medium">Nome</label><input type="text" name="name" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? service.name : ''}" required></div>
            <div><label class="block text-sm font-medium">URL da Imagem</label><input type="text" name="image" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? service.image : ''}"></div>
            <div class="grid grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium">Preço</label><input type="number" name="price" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? service.price : ''}" required></div>
                <div><label class="block text-sm font-medium">Duração (min)</label><input type="number" name="duration" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? service.duration : ''}" required></div>
            </div>
            <button type="submit" data-style="primary-bg" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90">${isEditing ? 'Salvar' : 'Adicionar'}</button>
        </div></form>`;
        openModal(isEditing ? 'Editar Serviço' : 'Novo Serviço', formHTML);
        applyVisualChanges();
    }

    function showPlanForm(plan = null) {
        const isEditing = !!plan;
        const formHTML = `<form id="plan-form" data-id="${isEditing ? plan.id : ''}"><div class="space-y-4">
            <div><label class="block text-sm font-medium">Nome do Plano</label><input type="text" name="name" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? plan.name : ''}" required></div>
            <div><label class="block text-sm font-medium">Descrição</label><textarea name="description" class="mt-1 block w-full border-gray-300 rounded-md p-2">${isEditing ? plan.description : ''}</textarea></div>
            <div><label class="block text-sm font-medium">Preço Mensal</label><input type="number" name="price" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? plan.price : ''}" required></div>
            <button type="submit" data-style="primary-bg" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90">${isEditing ? 'Salvar' : 'Adicionar'}</button>
        </div></form>`;
        openModal(isEditing ? 'Editar Plano' : 'Novo Plano', formHTML);
        applyVisualChanges();
    }

    function showExpenseForm(expense = null) {
        const isEditing = !!expense;
        const formHTML = `<form id="expense-form" data-id="${isEditing ? expense.id : ''}"><div class="space-y-4">
            <div><label class="block text-sm font-medium">Descrição</label><input type="text" name="description" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? expense.description : ''}" required></div>
            <div><label class="block text-sm font-medium">Valor</label><input type="number" name="value" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md p-2" value="${isEditing ? expense.value : ''}" required></div>
            <button type="submit" data-style="primary-bg" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90">${isEditing ? 'Salvar' : 'Adicionar'}</button>
        </div></form>`;
        openModal(isEditing ? 'Editar Despesa' : 'Nova Despesa', formHTML);
        applyVisualChanges();
    }

    // --- LÓGICA DE SALVAR/DELETAR ---
    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.dataset.id ? parseInt(form.dataset.id) : null;
        const editId = form.dataset.editId ? parseInt(form.dataset.editId) : null;
        const formData = new FormData(form);
        
        if (form.id === 'service-form') {
            const serviceData = { name: formData.get('name'), image: formData.get('image'), price: parseFloat(formData.get('price')), duration: parseInt(formData.get('duration')) };
            if (id) data.services = data.services.map(s => s.id === id ? { ...s, ...serviceData } : s);
            else data.services.push({ ...serviceData, id: Date.now() });
            showMessage('Serviço salvo com sucesso!');
        } else if (form.id === 'plan-form') {
            const planData = { name: formData.get('name'), description: formData.get('description'), price: parseFloat(formData.get('price')) };
            if (id) data.plans = data.plans.map(p => p.id === id ? { ...p, ...planData } : p);
            else data.plans.push({ ...planData, id: Date.now() });
            showMessage('Plano salvo com sucesso!');
        } else if (form.id === 'expense-form') {
            const expenseData = { description: formData.get('description'), value: parseFloat(formData.get('value')) };
            if (id) data.expenses = data.expenses.map(exp => exp.id === id ? { ...exp, ...expenseData } : exp);
            else data.expenses.push({ ...expenseData, id: Date.now() });
            showMessage('Despesa salva com sucesso!');
        } else if (form.id === 'appointment-form') {
            const appointmentData = {
                date: formData.get('date'),
                time: formData.get('time'),
            };
            if (!appointmentData.date || !appointmentData.time) {
                showMessage('Por favor, selecione data e horário.', 'error');
                return;
            }

            if (editId) { // Editando um agendamento existente
                const index = data.appointments.findIndex(app => app.id === editId);
                if (index !== -1) {
                    data.appointments[index] = { ...data.appointments[index], ...appointmentData };
                    showMessage('Agendamento alterado com sucesso!');
                }
            } else { // Criando um novo agendamento
                const serviceId = parseInt(form.dataset.serviceId);
                data.appointments.push({
                    id: Date.now(),
                    clientId: 1, // Fixo para o cliente logado
                    serviceId: serviceId,
                    status: 'Agendado',
                    ...appointmentData
                });
                showMessage('Horário agendado com sucesso!');
            }
            
            closeModal();
            document.getElementById('my-appointments-content').innerHTML = renderClientAppointments();
            saveData();
            return;
        }
        
        saveData();
        navigateTo(document.querySelector('.nav-link.active').dataset.target);
        closeModal();
    }

    // --- LÓGICA DA VISÃO DO CLIENTE ---
    function renderCustomerView() {
        customerView.innerHTML = `
            <header class="bg-white shadow-md sticky top-0 z-20"><div class="container mx-auto px-4 py-4 flex justify-between items-center"><div class="flex items-center space-x-2"><img src="${data.settings.logoUrl}" class="app-logo w-10 h-10 rounded-full object-cover"><h1 class="text-xl md:text-2xl font-bold text-gray-800">Barber App</h1></div><button class="logout-btn text-sm text-red-600 hover:underline">Sair</button></div></header>
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
        
        applyVisualChanges();
        renderCustomerTab('schedule');
        customerView.querySelector('#customer-tabs').addEventListener('click', e => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (link) {
                customerView.querySelectorAll('#customer-tabs a').forEach(a => {
                    a.classList.remove('border-blue-500', 'text-blue-600');
                    a.classList.add('border-transparent', 'text-gray-500');
                });
                link.classList.add('border-blue-500', 'text-blue-600');
                link.classList.remove('border-transparent', 'text-gray-500');
                renderCustomerTab(link.dataset.tab);
            }
        });
    }

    function renderCustomerTab(tabName) {
        document.querySelectorAll('#customer-tab-content > div').forEach(div => div.classList.add('hidden'));
        const contentEl = document.getElementById(`${tabName}-content`);
        contentEl.classList.remove('hidden');

        if (tabName === 'schedule') {
            contentEl.innerHTML = `
                <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">Nossos Serviços</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">${data.services.map(s => `
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                        <img src="${s.image}" alt="${s.name}" class="w-full h-32 md:h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x300/cccccc/ffffff?text=Img';">
                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="font-bold text-md md:text-lg mb-1">${s.name}</h3>
                            <p class="text-gray-500 text-sm mb-2">${formatCurrency(s.price)} - ${s.duration} min</p>
                            <div class="mt-auto"><button data-id="${s.id}" class="schedule-service-btn w-full text-white font-semibold py-2 rounded-lg hover:opacity-90">Agendar</button></div>
                        </div>
                    </div>`).join('')}
                </div>`;
        } else if (tabName === 'my-appointments') {
            contentEl.innerHTML = renderClientAppointments();
        } else if (tabName === 'plans') {
            contentEl.innerHTML = `<h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">Conheça Nossos Planos</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">${data.plans.map(p => `
                    <div class="bg-white rounded-lg shadow-sm p-6 flex flex-col text-center">
                        <h3 class="text-xl font-bold text-slate-800 mb-2">${p.name}</h3>
                        <p class="text-gray-600 mb-4 flex-grow">${p.description}</p>
                        <p class="text-3xl font-bold mb-4">${formatCurrency(p.price)}<span class="text-lg font-normal">/mês</span></p>
                        <button data-style="primary-bg" class="w-full text-white font-semibold py-2 rounded-lg hover:opacity-90">Assinar Plano</button>
                    </div>`).join('')}
                </div>`;
        }
        applyVisualChanges();
    }

    function renderClientAppointments() {
        const clientAppointments = data.appointments.filter(a => a.clientId === 1); // Fixo para o cliente logado
        if (clientAppointments.length === 0) {
            return '<h2 class="text-2xl font-bold mb-4">Meus Agendamentos</h2><p class="text-center text-gray-500">Você ainda não possui horários marcados.</p>';
        }
        return `
            <h2 class="text-2xl font-bold mb-4">Meus Agendamentos</h2>
            <div class="space-y-4">
                ${clientAppointments.map(a => {
                    const service = data.services.find(s => s.id === a.serviceId);
                    return `<div class="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                                <div>
                                    <p class="font-bold text-lg">${service.name}</p>
                                    <p class="text-sm text-gray-600"><i class="fas fa-calendar-alt mr-2"></i>${formatDate(a.date)} às ${a.time}</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button data-id="${a.id}" class="edit-appointment-btn text-xs text-white px-3 py-1 rounded-md hover:opacity-90">Alterar</button>
                                    <button data-id="${a.id}" class="cancel-appointment-btn text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Cancelar</button>
                                </div>
                            </div>`
                }).join('')}
            </div>`;
    }

    function showSchedulingModal(service, appointmentToEdit = null) {
        const isEditing = !!appointmentToEdit;
        const timeSlots = [...data.availableTimeSlots].sort();
        
        const formHTML = `
            <form id="appointment-form" data-service-id="${service.id}" ${isEditing ? `data-edit-id="${appointmentToEdit.id}"` : ''} class="space-y-4">
                <p>Você está agendando: <strong data-style="primary-text">${service.name}</strong></p>
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
                <button type="submit" data-style="primary-bg" class="w-full text-white py-2 rounded-lg font-bold hover:opacity-90">${isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</button>
            </form>`;
        openModal(isEditing ? 'Alterar Horário' : `Agendar ${service.name}`, formHTML, 'max-w-lg');
        
        const dateInput = modal.querySelector('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        const updateSlots = (selectedDate) => {
            const timeSlotsContainer = modal.querySelector('#time-slots-container');
            const appointmentsOnDate = data.appointments
                .filter(a => a.date === selectedDate && (!isEditing || a.id !== appointmentToEdit.id))
                .map(a => a.time);
            
            timeSlotsContainer.innerHTML = timeSlots.map(slot => {
                const isDisabled = appointmentsOnDate.includes(slot);
                const isSelected = isEditing && appointmentToEdit.date === selectedDate && appointmentToEdit.time === slot;
                return `<div class="time-slot ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" data-time="${slot}">${slot}</div>`;
            }).join('');
            applyVisualChanges();
        };

        dateInput.addEventListener('change', (e) => {
            modal.querySelector('#selected-time').value = '';
            updateSlots(e.target.value);
        });

        if (isEditing) {
            updateSlots(appointmentToEdit.date);
        }
        applyVisualChanges();
    }

    // --- EVENT LISTENERS ---
    function initEventListeners() {
        document.getElementById('admin-login-form').addEventListener('submit', (e) => { e.preventDefault(); handleLogin('admin'); });
        document.getElementById('client-login-form').addEventListener('submit', (e) => { e.preventDefault(); handleLogin('client'); });
        
        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        modalBody.addEventListener('submit', handleFormSubmit);

        showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.classList.add('hidden'); registerFormContainer.classList.remove('hidden'); });
        showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerFormContainer.classList.add('hidden'); loginFormContainer.classList.remove('hidden'); });
        
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // Ação de Logout
            if (target.closest('.logout-btn')) {
                handleLogout();
                return;
            }

            // Navegação do Menu Admin
            const navLink = target.closest('#sidebar-nav .nav-link');
            if (navLink) {
                e.preventDefault();
                navigateTo(navLink.dataset.target);
                return;
            }

            // Seleção de Horário no Modal
            if (target.classList.contains('time-slot') && !target.classList.contains('disabled')) {
                const selectedSlot = modal.querySelector('.time-slot.selected');
                if (selectedSlot) selectedSlot.classList.remove('selected');
                target.classList.add('selected');
                modal.querySelector('#selected-time').value = target.dataset.time;
                applyVisualChanges();
                return;
            }

            const button = target.closest('button');
            if (!button) return;

            // Ações de Botões (apenas se logado)
            if (button.id === 'save-settings-btn') {
                const form = document.getElementById('settings-form');
                const originalButtonText = button.textContent;
                button.textContent = 'Salvando...';
                button.disabled = true;
                setTimeout(() => {
                    data.settings.primaryColor = form.querySelector('#color-picker').value;
                    data.settings.logoUrl = form.querySelector('#logo-url').value;
                    data.settings.backgroundImageUrl = form.querySelector('#background-url').value;
                    applyVisualChanges();
                    saveData();
                    button.textContent = 'Salvo!';
                    showMessage('Configurações salvas!');
                    setTimeout(() => {
                        button.textContent = originalButtonText;
                        button.disabled = false;
                    }, 2000);
                }, 500);
            }
            if (button.id === 'add-service-btn') showServiceForm();
            if (button.id === 'add-plan-btn') showPlanForm();
            if (button.id === 'add-expense-btn') showExpenseForm(); // Adicionado
            if (button.id === 'reset-data-btn') {
                showConfirmationModal('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.', () => {
                    localStorage.removeItem('barberAppData');
                    window.location.reload();
                });
            }
            if (button.id === 'add-time-slot-btn') {
                const newTimeInput = document.getElementById('new-time-slot');
                const newTime = newTimeInput.value;
                if (newTime && !data.availableTimeSlots.includes(newTime)) {
                    data.availableTimeSlots.push(newTime);
                    saveData();
                    renderPageContent('page-settings');
                    showMessage('Horário adicionado!');
                } else if (!newTime) {
                    showMessage('Por favor, selecione um horário.', 'error');
                } else {
                    showMessage('Este horário já existe.', 'error');
                }
            }
            if (button.classList.contains('delete-time-slot-btn')) {
                const timeToDelete = button.dataset.time;
                data.availableTimeSlots = data.availableTimeSlots.filter(slot => slot !== timeToDelete);
                saveData();
                renderPageContent('page-settings');
                showMessage('Horário removido!');
            }
            const tableRow = target.closest('tr[data-id]');
            if (tableRow) {
                const id = parseInt(tableRow.dataset.id);
                if (button.classList.contains('edit-service-btn')) showServiceForm(data.services.find(s => s.id === id));
                if (button.classList.contains('delete-service-btn')) { data.services = data.services.filter(s => s.id !== id); saveData(); navigateTo('page-services'); showMessage('Serviço excluído!'); }
                if (button.classList.contains('edit-plan-btn')) showPlanForm(data.plans.find(p => p.id === id));
                if (button.classList.contains('delete-plan-btn')) { data.plans = data.plans.filter(p => p.id !== id); saveData(); navigateTo('page-plans'); showMessage('Plano excluído!'); }
                if (button.classList.contains('edit-expense-btn')) showExpenseForm(data.expenses.find(exp => exp.id === id)); // Adicionado
                if (button.classList.contains('delete-expense-btn')) { data.expenses = data.expenses.filter(exp => exp.id !== id); saveData(); navigateTo('page-expenses'); showMessage('Despesa excluída!'); } // Adicionado
                if (button.classList.contains('delete-appointment-btn')) { data.appointments = data.appointments.filter(a => a.id !== id); saveData(); navigateTo('page-appointments'); showMessage('Agendamento excluído!'); }
            }
            if (button.classList.contains('schedule-service-btn')) {
                const serviceId = parseInt(button.dataset.id);
                const service = data.services.find(s => s.id === serviceId);
                showSchedulingModal(service);
            }
            if (button.classList.contains('cancel-appointment-btn')) {
                const appointmentId = parseInt(button.dataset.id);
                showConfirmationModal('Tem certeza que deseja cancelar este agendamento?', () => {
                    data.appointments = data.appointments.filter(app => app.id !== appointmentId);
                    saveData();
                    showMessage('Agendamento cancelado com sucesso!');
                    document.getElementById('my-appointments-content').innerHTML = renderClientAppointments();
                    applyVisualChanges();
                });
            }
            if (button.classList.contains('edit-appointment-btn')) {
                const appointmentId = parseInt(button.dataset.id);
                const appointment = data.appointments.find(app => app.id === appointmentId);
                const service = data.services.find(s => s.id === appointment.serviceId);
                showSchedulingModal(service, appointment);
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    loadData();
    initEventListeners();
    applyVisualChanges();
});