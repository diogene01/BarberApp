import { renderSubscriptionPage } from "../pages/subscription.js";
import { renderDashboardPage } from "../pages/dashboard.js";
import { renderAppointmentsPage, renderClientsPage } from "../pages/appointments.js";
import { renderPlansPage } from "../pages/plans.js";
import { renderExpensesPage } from "../pages/expenses.js";
import { renderSettingsPage } from "../pages/settings.js";
import { renderServicesPage } from "../pages/services.js";
import { barberData } from "../service/searchData.js";
import { applyVisualChanges } from "../components/visualChanges.js";
import { LoggedInUser } from "../handlers/handleThings.js";


const sidebarNav = document.getElementById('sidebar-nav');
const contentPages = document.querySelectorAll('.page-content');
const pageTitleEl = document.getElementById('page-title');



// --- LÓGICA DE NAVEGAÇÃO E RENDERIZAÇÃO ---
// Navega para uma página específica no painel do barbeiro
export function navigateTo(targetPageId) {
    sidebarNav.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.target === targetPageId);
    });
    contentPages.forEach(page => {
        page.classList.toggle('hidden', page.id !== targetPageId);
    });
    const activeLink = sidebarNav.querySelector(`[data-target="${targetPageId}"]`);
    pageTitleEl.textContent = activeLink.textContent.trim();
    renderPageContent(targetPageId);
}


// Renderiza o conteúdo da página ativa no painel do barbeiro
export function renderPageContent(pageId) {
    const pageContainer = document.getElementById(pageId);
    if (!pageContainer) return;

    switch (pageId) {
        case 'page-dashboard': renderDashboardPage(pageContainer, barberData); break;
        case 'page-appointments': renderAppointmentsPage(pageContainer, barberData); break;
        case 'page-services': renderServicesPage(pageContainer, barberData); break;
        case 'page-plans': renderPlansPage(pageContainer, barberData); break;
        case 'page-clients': renderClientsPage(pageContainer, barberData); break;
        case 'page-expenses': renderExpensesPage(pageContainer, barberData); break;
        case 'page-subscription': renderSubscriptionPage(pageContainer, barberData); break;
        case 'page-settings': renderSettingsPage(pageContainer, LoggedInUser); break;
    }
    applyVisualChanges(LoggedInUser); // Garante que a cor seja aplicada ao mudar de página
}