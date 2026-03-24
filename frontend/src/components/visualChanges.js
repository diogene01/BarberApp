import { customerView } from "../pages/customers.js";

// Atualiza o logo e a imagem de fundo com base no barbeiro ativo
export function applyVisualChanges(barber) {
    if(barber){
        // Use URLs padrão se nenhum barbeiro estiver ativo
        const logo = barber?.logo_url || 'https://placehold.co/100x100/334155/FFFFFF?text=Logo';
        const bgImage = barber?.background_image_url || 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop';
        
        document.querySelectorAll('.app-logo').forEach(el => el.src = logo);
        customerView.style.backgroundImage = `url(${bgImage})`;
    }
}