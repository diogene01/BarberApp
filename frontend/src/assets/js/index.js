import { showServiceForm } from "../../pages/services.js";
import { modal, openModal, closeModal, startModal  } from "../../components/modal.js";
import { handleLogin, handleBarberCode, handleLogout, handleDelete, handleRegister } from "../../handlers/handleThings.js";
import { renderCustomerTab, renderCustomerView, showSchedulingModal } from "../../pages/customers.js";
import { showPlanForm } from "../../pages/plans.js";
import { showExpenseForm } from "../../pages/expenses.js";
import { fetchBarberData, barberData } from "../../service/searchData.js";
import { navigateTo, renderPageContent } from "../../components/navigateAndRendering.js";
import { LoggedInUser } from "../../handlers/handleThings.js";
import { showMessage } from "../../utils/showMenssage.js";


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente carregado e analisado. Inicializando a aplicação.");

    // --- CONSTANTES E VARIÁVEIS DE ESTADO ---
    const API_URL = 'http://localhost:3000';

    // --- ELEMENTOS DO DOM (simplificado para clareza) ---
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');


    


    // Exibe um modal de confirmação antes de uma ação destrutiva
    function showConfirmationModal(message, onConfirm) {
        console.log("Exibindo modal de confirmação.");
        const modalHTML = `
            <p class="text-center mb-6">${message}</p>
            <div class="flex justify-end space-x-4">
                <button id="confirm-cancel-btn" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Voltar</button>
                <button id="confirm-action-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirmar</button>
            </div>
        `;
        openModal('Confirmação', modalHTML, 'max-w-sm');

        document.getElementById('confirm-action-btn').onclick = () => {
            console.log("Ação confirmada. Executando callback...");
            onConfirm();
            closeModal();
        };
        document.getElementById('confirm-cancel-btn').onclick = () => {
            console.log("Ação cancelada.");
            closeModal();
        }
    }
    

    // --- EVENT LISTENERS (ESPERAM POR INTERAÇÕES DO USUÁRIO) ---
    function initEventListeners() {
        console.log("Inicializando event listeners.");

        // Atribui listeners para os formulários de login e cadastro
        document.getElementById('admin-login-form').addEventListener('submit', async(e) => await handleLogin(e, 'barber'));
        document.getElementById('client-login-form').addEventListener('submit', async(e) => await handleLogin(e, 'client'));
        document.getElementById('barber-code-form').addEventListener('submit', handleBarberCode);
        document.getElementById('register-form').addEventListener('submit', handleRegister);

        
            // Listener para a máscara de telefone no campo de cadastro, que aparece conforme o usuário digita.
        document.getElementById('register-phone').addEventListener('input', (e) => {
            // 1. Limpa o valor, mantendo apenas os dígitos
            let value = e.target.value.replace(/\D/g, '');
            
            // 2. Limita o número de dígitos a 11 (DDD + número)
            value = value.substring(0, 11);

            // 3. Aplica a formatação progressivamente
            if (value.length > 10) {
                // Formato para celular com 9º dígito: (XX) XXXXX-XXXX
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 6) {
                // Formato para telefone fixo ou celular com 8 dígitos: (XX) XXXX-XXXX
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                // Formato para quando o usuário digita o número após o DDD: (XX) X...
                value = value.replace(/^(\d{2})(\d*)$/, '($1) $2');
            } else if (value.length > 0) {
                // Formato para quando o usuário começa a digitar o DDD: (X...
                value = value.replace(/^(\d*)$/, '($1');
            }
            
            // 4. Atualiza o valor no campo
            e.target.value = value;
        });


        // Listeners para cliques globais
        document.body.addEventListener('click', (e) => {
            const target = e.target;
            
                // Ação de mostrar/esconder senha
            const togglePasswordIcon = target.closest('[data-toggle-password]');
            if (togglePasswordIcon) {
                const inputId = togglePasswordIcon.getAttribute('data-toggle-password');
                const passwordInput = document.getElementById(inputId);
                if (passwordInput) {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    togglePasswordIcon.classList.toggle('fa-eye-slash', !isPassword);
                    togglePasswordIcon.classList.toggle('fa-eye', isPassword);
                }
                return;
            }

            // Botão de logout
            if (target.closest('.logout-btn')) {
                handleLogout();
                return;
            }

            // Botões de navegação lateral (painel do barbeiro)
            const navLink = target.closest('#sidebar-nav .nav-link');
            if (navLink) {
                e.preventDefault();
                navigateTo(navLink.dataset.target);
                return;
            }

            // Abas de navegação do cliente
            const customerTab = target.closest('#customer-tabs a');
            if (customerTab) {
                e.preventDefault();
                document.querySelectorAll('#customer-tabs a').forEach(a => {
                    a.classList.remove('border-blue-500', 'text-blue-600');
                    a.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                });
                customerTab.classList.add('border-blue-500', 'text-blue-600');
                customerTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                renderCustomerTab(customerTab.dataset.tab);
                return;
            }

            // Seleção de horários no modal
            if (target.classList.contains('time-slot') && !target.classList.contains('disabled')) {
                const selectedTimeInput = document.getElementById('selected-time');
                modal.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
                target.classList.add('selected');
                selectedTimeInput.value = target.dataset.time;
                return;
            }
        });
        
        startModal();

        // Atribui listeners para os botões de ação dinâmica (adicionar, editar, deletar)
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const id = target.dataset.id;
            const expenseType = target.dataset.expenseType;

            if (target.id === 'add-service-btn') showServiceForm();
            if (target.id === 'add-plan-btn') showPlanForm();
            if (target.id === 'add-expense-btn') showExpenseForm();
            
            if (target.classList.contains('edit-service-btn')) showServiceForm(barberData.services.find(s => s.id === parseInt(id)));
            if (target.classList.contains('delete-service-btn')) showConfirmationModal('Tem certeza que deseja excluir este serviço?', () => handleDelete(e, 'services'));
            if (target.classList.contains('edit-plan-btn')) showPlanForm(barberData.plans.find(p => p.id === parseInt(id)));
            if (target.classList.contains('delete-plan-btn')) showConfirmationModal('Tem certeza que deseja excluir este plano?', () => handleDelete(e, 'plans'));
            if (target.classList.contains('edit-expense-btn')) showExpenseForm(barberData.expenses.find(exp => exp.id === parseInt(id)));
            if (target.classList.contains('delete-expense-btn')) showConfirmationModal('Tem certeza que deseja excluir esta despesa?', () => handleDelete(e, 'expenses'));
            if (target.classList.contains('delete-appointment-btn')) showConfirmationModal('Tem certeza que deseja excluir este agendamento?', () => handleDelete(e, 'appointments'));
            
            if (target.classList.contains('schedule-service-btn')) {
                const service = barberData.services.find(s => s.id === parseInt(id));
                showSchedulingModal(service);
            }
            if (target.classList.contains('edit-appointment-btn')) {
                const appointment = barberData.appointments.find(a => a.id === parseInt(id));
                const service = barberData.services.find(s => s.id === appointment.service_id);
                showSchedulingModal(service, appointment);
            }
            if (target.classList.contains('cancel-appointment-btn')) {
                showConfirmationModal('Tem certeza que deseja cancelar este agendamento?', async () => {
                    try {
                        const response = await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
                        const result = await response.json();
                        if (response.ok) {
                            showMessage(result.message, 'success');
                            await fetchBarberData(LoggedInUser, API_URL);
                            renderCustomerView();
                        } else {
                            showMessage(result.error, 'error');
                        }
                    } catch (error) {
                        console.error('Erro ao cancelar agendamento:', error);
                        showMessage('Erro ao conectar com o servidor.', 'error');
                    }
                });
            }

            if (target.id === 'reset-data-btn') {
                showConfirmationModal('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita e afetará todos os clientes do sistema.', async () => {
                    try {
                        const response = await fetch(`${API_URL}/reset-data`, { method: 'POST' });
                        const result = await response.json();
                        if (response.ok) {
                            showMessage(result.message, 'success');
                            window.location.reload();
                        } else {
                            showMessage(result.error, 'error');
                        }
                    } catch (error) {
                        console.error('Erro ao resetar dados:', error);
                        showMessage('Erro ao conectar com o servidor.', 'error');
                    }
                });
            }

            if (target.id === 'add-time-slot-btn') {
                const newTimeInput = document.getElementById('new-time-slot');
                const newTime = newTimeInput.value;
                if (!newTime) {
                    showMessage('Por favor, selecione um horário.', 'error');
                    return;
                }

                if (barberData.availableTimeSlots.includes(newTime)) {
                    showMessage('Este horário já existe.', 'error');
                    return;
                }

                barberData.availableTimeSlots.push(newTime);
                renderPageContent('page-settings');
                showMessage('Horário adicionado!', 'success');
            }


            if (target.classList.contains('delete-time-slot-btn')) {
                const timeToDelete = target.dataset.time;
                barberData.availableTimeSlots = barberData.availableTimeSlots.filter(slot => slot !== timeToDelete);
                renderPageContent('page-settings');
                showMessage('Horário removido!', 'success');
            }


            if(target.id == "save-settings-btn"){
                showConfirmationModal('Tem certeza que deseja salvar as alterações de perfil e horários?', async () => {
                try {
                    // 1. Obtém o ID do barbeiro logado através da variável importada ou do localStorage
                    const barberId = LoggedInUser.id;


                    if (!barberId) {
                        showMessage('Erro: Usuário não identificado. Faça login novamente.', 'error');
                        return;
                    }

                    // 2. Coleta os dados dos inputs da sua página de configurações
                    // Certifique-se de que esses IDs existem no seu HTML/DOM
                    const updatedSettings = {
                        logo_url: document.getElementById('logo-url')?.value || barberData.logo_url,
                        background_image_url: document.getElementById('background-url')?.value || barberData.background_image_url,
                        // Converte o array de horários que você tem no barberData em uma string separada por vírgulas
                        available_time_slots: barberData.availableTimeSlots.join(',')
                    };

                    console.log(updatedSettings);

                    // 3. Faz a requisição PUT para a rota correta do seu servidor
                    const response = await fetch(`${API_URL}/settings/${barberId}`, { 
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedSettings)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        showMessage(result.message, 'success');
                        // Atualiza os dados locais para refletir a mudança
                        await fetchBarberData(LoggedInUser, API_URL);
                    } else {
                        showMessage(result.error || 'Erro ao salvar configurações.', 'error');
                    }
                } catch (error) {
                    console.error('Erro ao salvar dados:', error);
                    showMessage('Erro ao conectar com o servidor.', 'error');
                }
                });
            }
        });

        

        // Links para alternar formulários
        showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.classList.add('hidden'); registerFormContainer.classList.remove('hidden'); });
        showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerFormContainer.classList.add('hidden'); loginFormContainer.classList.remove('hidden'); });


    }



    // --- INICIALIZAÇÃO ---
    initEventListeners();
    // A inicialização da aplicação depende do login. Nenhum dado é carregado antes.
});