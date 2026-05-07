# ✂️ BarberApp - Sistema de Agendamento Profissional

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

O **BarberApp** é uma plataforma Fullstack completa desenvolvida para modernizar a gestão de barbearias e facilitar o agendamento de clientes. Com uma interface responsiva e atualizações em tempo real via WebSockets, o sistema oferece painéis distintos para Barbeiros (Gestão) e Clientes (Agendamento).

---

## 🚀 Funcionalidades Principais

### 👔 Painel do Barbeiro (Admin)
- **Gestão Financeira:** Controle de despesas e visualização de faturamento.
- **Configuração de Identidade:** Personalização de logo, nome, telefone e imagem de fundo da área do cliente.
- **Agenda em Tempo Real:** Visualização dinâmica de agendamentos com notificações via Socket.io.
- **Catálogo de Serviços e Planos:** Cadastro, edição e exclusão de serviços e planos mensais.
- **Gestão de Horários:** Configuração flexível de slots de tempo disponíveis.

### 👤 Área do Cliente
- **Perfil Personalizado:** Edição de dados cadastrais e máscara de telefone inteligente.
- **Agendamento Inteligente:** Interface intuitiva para escolha de serviços, datas e horários (bloqueando horários já ocupados).
- **Meus Agendamentos:** Visualização e cancelamento de horários marcados.
- **Design Adaptativo:** Experiência otimizada para mobile com menu de perfil (Engrenagem) e interface *clean*.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 & JavaScript (ES6+):** Estrutura e lógica cliente-side.
- **Tailwind CSS:** Estilização moderna e totalmente responsiva.
- **Socket.io-client:** Comunicação bidirecional em tempo real.
- **FontAwesome:** Ícones profissionais.

### Backend
- **Node.js & Express:** Servidor robusto e roteamento de API.
- **MySQL:** Banco de dados relacional para persistência de dados.
- **Socket.io:** Emissão de eventos para atualização instantânea da interface.
- **Dotenv:** Gerenciamento de variáveis de ambiente e segurança.

---

## 📦 Como rodar o projeto

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/seu-usuario/barber-app.git](https://github.com/seu-usuario/barber-app.git)