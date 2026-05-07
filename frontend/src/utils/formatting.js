export const formatCurrency = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

export const formatTime = (date) =>
    new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function formatPhoneInput(value) {
    let v = value.replace(/\D/g, '').substring(0, 11);
    
    if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
    } else if (v.length > 0) {
        v = v.replace(/^(\d*)$/, '($1');
    }
    
    return v;
}
