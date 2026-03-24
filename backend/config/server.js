// Importa as dependências necessárias para criar o servidor
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
//const express = require('express');
//const mysql = require('mysql2/promise'); // Usamos a versão com promises para facilitar o async/await
//const cors = require('cors'); // Middleware para permitir requisições de outras origens

// Cria a aplicação Express
const app = express();
const port = 3000;

// Middleware para processar requisições em JSON e para permitir CORS
// O express.json() é crucial para o servidor conseguir ler o corpo das requisições POST/PUT
app.use(express.json());
app.use(cors());

// Configuração do pool de conexões com o banco de dados
// Usar um pool é mais eficiente para gerenciar múltiplas conexões simultâneas
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Altere se o seu usuário for diferente
    password: '', // Altere para a sua senha do MySQL
    database: 'barber_app_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ----------------------------------------
// --- ROTAS DA API ---
// ----------------------------------------

/**
 * @route POST /register
 * @description Rota para cadastrar um novo usuário (cliente ou barbeiro)
 * @body {string} name, {string} email, {string} password, {string} phone, {string} userType
 */
/**
 * @route POST /register
 * @description Rota para cadastrar um novo usuário com verificação de código único
 */
app.post('/register', async (req, res) => {
    console.log('API: Recebendo requisição de cadastro...');
    const { name, email, password, phone, userType } = req.body;

    if (!name || !email || !password || !phone || !userType) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        if (userType === 'client') {
            const [result] = await pool.execute(
                'INSERT INTO clients (name, email, password, phone) VALUES (?, ?, ?, ?)', 
                [name, email, password, phone]
            );
            res.status(201).json({ message: 'Cliente cadastrado com sucesso!', userId: result.insertId });
            
        } else if (userType === 'barber') {
            console.log('API: Gerando código único para o barbeiro...');
            
            let code;
            let codeExists = true;

            // Loop para garantir que o código gerado é único
            while (codeExists) {
                code = `BARBER${Math.floor(10000 + Math.random() * 90000)}`; // Garante sempre 5 dígitos
                const [rows] = await pool.execute('SELECT id FROM barbers WHERE code = ?', [code]);
                if (rows.length === 0) {
                    codeExists = false;
                }
            }

            console.log('API: Código único gerado:', code);

            const [result] = await pool.execute(
                'INSERT INTO barbers (name, email, password, phone, code) VALUES (?, ?, ?, ?, ?)', 
                [name, email, password, phone, code]
            );
            
            // Cria as configurações padrão
            await pool.execute(
                'INSERT INTO settings (barber_id, logo_url, background_image_url, available_time_slots) VALUES (?, ?, ?, ?)', 
                [result.insertId, 'https://placehold.co/100x100/334155/FFFFFF?text=Logo', 'https://images.unsplash.com/photo-1622288432458-2d7c3a6e3e0d?q=80&w=1932&auto=format&fit=crop', '09:00,09:30,10:00,10:30,11:00,11:30,14:00,14:30,15:00,15:30,16:00,16:30,17:00']
            );
            
            res.status(201).json({ 
                message: `Barbeiro cadastrado com sucesso! Seu código é: ${code}`, 
                userId: result.insertId, 
                code: code 
            });
        } else {
            res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }
    } catch (error) {
        console.error('API: Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário. O e-mail já pode estar em uso.' });
    }
});

/**
 * @route POST /login
 * @description Rota para autenticar um usuário
 * @body {string} email, {string} password, {string} userType
 */
app.post('/login', async (req, res) => {
    console.log('API: Recebendo requisição de login...');
    const { email, password, userType } = req.body;
    console.log('API: Dados de login recebidos:', { email, password, userType });

    if (!email || !password || !userType) {
        console.error('API: Erro de validação - campos de login obrigatórios faltando.');
        return res.status(400).json({ error: 'Email, senha e tipo de usuário são obrigatórios.' });
    }

    try {
        let query = '';
        if (userType === 'barber') {
            query = `
                SELECT b.id, b.name, b.email, b.phone, b.code, 
                    b.subscription_status, b.subscription_due_date,
                    s.logo_url, s.background_image_url
                FROM barbers b
                LEFT JOIN settings s ON b.id = s.barber_id
                WHERE b.email = ? AND b.password = ?;
            `;
        } else if (userType === 'client') {
            query = 'SELECT id, name, email, phone FROM clients WHERE email = ? AND password = ?';
        } else {
            console.error('API: Tipo de usuário inválido recebido.');
            return res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }

        console.log('API: Executando consulta de login...');
        const [rows] = await pool.execute(query, [email, password]);

        if (rows.length > 0) {
            console.log('API: Login bem-sucedido para o usuário:', rows[0].email);
            res.status(200).json({ message: 'Login bem-sucedido!', user: rows[0] });
        } else {
            console.log('API: Login falhou - email ou senha incorretos.');
            res.status(401).json({ error: 'Email ou senha incorretos.' });
        }
    } catch (error) {
        console.error('API: Erro no login:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /barbers
 * @description Rota para buscar informações de um barbeiro pelo código
 * @query {string} code
 */
app.get('/barbers', async (req, res) => {
    console.log('API: Recebendo requisição para buscar barbeiro por código...');
    const { code } = req.query;

    if (!code) {
        console.error('API: Erro de validação - código do barbeiro é obrigatório.');
        return res.status(400).json({ error: 'Código da barbearia é obrigatório.' });
    }

    try {
        console.log('API: Buscando barbeiro com código:', code);
        const [rows] = await pool.execute('SELECT id, name, code FROM barbers WHERE code = ?', [code]);
        
        if (rows.length > 0) {
            console.log('API: Barbeiro encontrado. Buscando configurações...');
            const [settings] = await pool.execute('SELECT logo_url, background_image_url FROM settings WHERE barber_id = ?', [rows[0].id]);
            rows[0].logo_url = settings[0].logo_url;
            rows[0].background_image_url = settings[0].background_image_url;
            
            res.status(200).json(rows);
        } else {
            console.log('API: Barbearia não encontrada para o código:', code);
            res.status(404).json({ error: 'Barbearia não encontrada.' });
        }
    } catch (error) {
        console.error('API: Erro ao buscar barbeiro:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /services/:barberId
 * @description Rota para buscar todos os serviços de um barbeiro
 * @params {number} barberId
 */
app.get('/services/:barberId', async (req, res) => {
    console.log(`API: Buscando serviços para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM services WHERE barber_id = ?', [barberId]);
        console.log(`API: Encontrados ${rows.length} serviços.`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('API: Erro ao buscar serviços:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /plans/:barberId
 * @description Rota para buscar todos os planos de um barbeiro
 * @params {number} barberId
 */
app.get('/plans/:barberId', async (req, res) => {
    console.log(`API: Buscando planos para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM plans WHERE barber_id = ?', [barberId]);
        console.log(`API: Encontrados ${rows.length} planos.`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('API: Erro ao buscar planos:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /appointments/:barberId
 * @description Rota para buscar todos os agendamentos de um barbeiro
 * @params {number} barberId
 */
app.get('/appointments/:barberId', async (req, res) => {
    console.log(`API: Buscando agendamentos para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM appointments WHERE barber_id = ?', [barberId]);
        console.log(`API: Encontrados ${rows.length} agendamentos.`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('API: Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /expenses/:barberId
 * @description Rota para buscar todas as despesas de um barbeiro
 * @params {number} barberId
 */ 
app.get('/expenses/:barberId', async (req, res) => {
    console.log(`API: Buscando despesas para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM expenses WHERE barber_id = ?', [barberId]);
        console.log(`API: Encontrados ${rows.length} despesas.`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('API: Erro ao buscar despesas:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /clients/:barberId
 * @description Rota para buscar todos os clientes de um barbeiro (para o painel administrativo)
 * @params {number} barberId
 */
app.get('/clients/:barberId', async (req, res) => {
    console.log(`API: Buscando clientes para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        // Essa consulta é um JOIN para pegar os dados dos clientes que agendaram com o barbeiro
        const [rows] = await pool.execute('SELECT DISTINCT c.* FROM clients c JOIN appointments a ON c.id = a.client_id WHERE a.barber_id = ?', [barberId]);
        console.log(`API: Encontrados ${rows.length} clientes.`);
        res.status(200).json(rows);
    } catch (error) {
        console.error('API: Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route GET /settings/:barberId
 * @description Rota para buscar as configurações de um barbeiro
 * @params {number} barberId
 */
app.get('/settings/:barberId', async (req, res) => {
    console.log(`API: Buscando configurações para o barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    try {
        const [rows] = await pool.execute('SELECT logo_url, background_image_url, available_time_slots FROM settings WHERE barber_id = ?', [barberId]);
        if (rows.length > 0) {
            console.log('API: Configurações encontradas.');
            res.status(200).json(rows[0]);
        } else {
            console.error('API: Configurações não encontradas para o barbeiro:', barberId);
            res.status(404).json({ error: 'Configurações não encontradas.' });
        }
    } catch (error) {
        console.error('API: Erro ao buscar configurações:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// ----------------------------------------
// --- ROTAS DE MANIPULAÇÃO DE DADOS ---
// ----------------------------------------

/**
 * @route POST /services
 * @description Adiciona um novo serviço
 * @body {number} barber_id, {string} name, {number} price, {number} duration_minutes, {string} image_url
 */
app.post('/services', async (req, res) => {
    console.log('API: Recebendo requisição para adicionar serviço...');
    const { barber_id, name, price, duration_minutes, image_url } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO services (barber_id, name, price, duration, image_url) VALUES (?, ?, ?, ?, ?)', [barber_id, name, price, duration_minutes, image_url]);
        console.log('API: Serviço adicionado com sucesso! ID:', result.insertId);
        res.status(201).json({ message: 'Serviço adicionado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('API: Erro ao adicionar serviço:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route PUT /services/:id
 * @description Atualiza um serviço existente
 * @params {number} id
 * @body {string} name, {number} price, {number} duration_minutes, {string} image_url
 */
app.put('/services/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para atualizar serviço ${req.params.id}...`);
    const { id } = req.params;
    const { name, price, duration_minutes, image_url } = req.body;
    try {
        await pool.execute('UPDATE services SET name = ?, price = ?, duration = ?, image_url = ? WHERE id = ?', [name, price, duration_minutes, image_url, id]);
        console.log('API: Serviço atualizado com sucesso!');
        res.status(200).json({ message: 'Serviço atualizado com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao atualizar serviço:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route DELETE /services/:id
 * @description Deleta um serviço
 * @params {number} id
 */
app.delete('/services/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para deletar serviço ${req.params.id}...`);
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM services WHERE id = ?', [id]);
        console.log('API: Serviço excluído com sucesso!');
        res.status(200).json({ message: 'Serviço excluído com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao deletar serviço:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route POST /plans
 * @description Adiciona um novo plano
 * @body {number} barber_id, {string} name, {string} description, {number} price
 */
app.post('/plans', async (req, res) => {
    console.log('API: Recebendo requisição para adicionar plano...');
    const { barber_id, name, description, price } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO plans (barber_id, name, description, price) VALUES (?, ?, ?, ?)', [barber_id, name, description, price]);
        console.log('API: Plano adicionado com sucesso! ID:', result.insertId);
        res.status(201).json({ message: 'Plano adicionado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('API: Erro ao adicionar plano:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route PUT /plans/:id
 * @description Atualiza um plano existente
 * @params {number} id
 * @body {string} name, {string} description, {number} price
 */
app.put('/plans/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para atualizar plano ${req.params.id}...`);
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        await pool.execute('UPDATE plans SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id]);
        console.log('API: Plano atualizado com sucesso!');
        res.status(200).json({ message: 'Plano atualizado com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao atualizar plano:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route DELETE /plans/:id
 * @description Deleta um plano
 * @params {number} id
 */
app.delete('/plans/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para deletar plano ${req.params.id}...`);
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM plans WHERE id = ?', [id]);
        console.log('API: Plano excluído com sucesso!');
        res.status(200).json({ message: 'Plano excluído com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao deletar plano:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});


/**
 * @route POST /appointments
 * @description Adiciona um novo agendamento com verificação de conflito de horário
 * @body {number} barber_id, {number} client_id, {number} service_id, {string} date, {string} time, {string} status
 */
app.post('/appointments', async (req, res) => {
    console.log('API: Validando novo agendamento...');
    let { barber_id, client_id, service_id, date, time, status } = req.body;

    // 1. LIMPEZA TOTAL: Remove espaços em branco invisíveis que quebram a busca
    const cleanDate = date?.toString().trim();
    const cleanTime = time?.toString().trim();

    if (!barber_id || !client_id || !cleanDate || !cleanTime) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    try {
        // 2. BUSCA SEM FALHAS: 
        // Usamos TIME() para garantir que o MySQL trate os dois lados como HORA, 
        // ignorando se um tem segundos (:00) e o outro não.
        const [rows] = await pool.execute(
            `SELECT id FROM appointments 
             WHERE barber_id = ? 
             AND date = ? 
             AND TIME(time) = TIME(?)`,
            [barber_id, cleanDate, cleanTime]
        );

        if (rows.length > 0) {
            console.log(`BLOQUEADO: Conflito em ${cleanDate} às ${cleanTime}`);
            return res.status(409).json({ 
                error: 'Este horário já está ocupado. Por favor, escolha outro.' 
            });
        }

        // 3. SE CHEGOU AQUI, ESTÁ LIVRE:
        const [result] = await pool.execute(
            'INSERT INTO appointments (barber_id, client_id, service_id, date, time, status) VALUES (?, ?, ?, ?, ?, ?)',
            [barber_id, client_id, service_id, cleanDate, cleanTime, status || 'Agendado']
        );

        console.log('Agendamento criado com sucesso! ID:', result.insertId);
        res.status(201).json({ message: 'Agendamento criado com sucesso!', id: result.insertId });

    } catch (error) {
        console.error('Erro na API:', error);
        res.status(500).json({ error: 'Erro interno ao processar agendamento.' });
    }
});

/**
 * @route PUT /appointments/:id
 * @description Atualiza um agendamento existente
 * @params {number} id
 * @body {string} date, {string} time, {string} status
 */
app.put('/appointments/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para atualizar agendamento ${req.params.id}...`);
    const { id } = req.params;
    const { date, time, status } = req.body;
    try {
        await pool.execute('UPDATE appointments SET date = ?, time = ?, status = ? WHERE id = ?', [date, time, status, id]);
        console.log('API: Agendamento atualizado com sucesso!');
        res.status(200).json({ message: 'Agendamento atualizado com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao atualizar agendamento:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route DELETE /appointments/:id
 * @description Deleta um agendamento
 * @params {number} id
 */
app.delete('/appointments/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para deletar agendamento ${req.params.id}...`);
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM appointments WHERE id = ?', [id]);
        console.log('API: Agendamento excluído com sucesso!');
        res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao deletar agendamento:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route POST /expenses
 * @description Adiciona uma nova despesa
 * @body {number} barber_id, {string} description, {number} value
 */
app.post('/expenses', async (req, res) => {
    console.log('API: Recebendo requisição para adicionar despesa...');
    const { barber_id, description, value } = req.body;
    try {
        const [result] = await pool.execute('INSERT INTO expenses (barber_id, description, value) VALUES (?, ?, ?)', [barber_id, description, value]);
        console.log('API: Despesa adicionada com sucesso! ID:', result.insertId);
        res.status(201).json({ message: 'Despesa adicionada com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('API: Erro ao adicionar despesa:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route PUT /expenses/:id
 * @description Atualiza uma despesa existente
 * @params {number} id
 * @body {string} description, {number} value
 */
app.put('/expenses/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para atualizar despesa ${req.params.id}...`);
    const { id } = req.params;
    const { description, value } = req.body;
    try {
        await pool.execute('UPDATE expenses SET description = ?, value = ? WHERE id = ?', [description, value, id]);
        console.log('API: Despesa atualizada com sucesso!');
        res.status(200).json({ message: 'Despesa atualizada com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao atualizar despesa:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route DELETE /expenses/:id
 * @description Deleta uma despesa
 * @params {number} id
 */
app.delete('/expenses/:id', async (req, res) => {
    console.log(`API: Recebendo requisição para deletar despesa ${req.params.id}...`);
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM expenses WHERE id = ?', [id]);
        console.log('API: Despesa excluída com sucesso!');
        res.status(200).json({ message: 'Despesa excluída com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao deletar despesa:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route PUT /settings/:barberId
 * @description Atualiza as configurações de um barbeiro
 * @params {number} barberId
 * @body {string} logo_url, {string} background_image_url, {string} available_time_slots
 */
app.put('/settings/:barberId', async (req, res) => {
    console.log(`API: Recebendo requisição para atualizar configurações do barbeiro ${req.params.barberId}...`);
    const { barberId } = req.params;
    const { logo_url, background_image_url, available_time_slots } = req.body;
    try {
        await pool.execute('UPDATE settings SET logo_url = ?, background_image_url = ?, available_time_slots = ? WHERE barber_id = ?', [logo_url, background_image_url, available_time_slots, barberId]);
        console.log('API: Configurações atualizadas com sucesso!');
        res.status(200).json({ message: 'Configurações atualizadas com sucesso!' });
    } catch (error) {
        console.error('API: Erro ao atualizar configurações:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @route POST /reset-data
 * @description Rota para resetar os dados do banco. **CUIDADO: APAGA TUDO!**
 */
app.post('/reset-data', async (req, res) => {
    console.log('API: Recebendo requisição para resetar todos os dados...');
    try {
        // Sequência de exclusão para respeitar as chaves estrangeiras
        await pool.execute('DELETE FROM appointments');
        await pool.execute('DELETE FROM expenses');
        await pool.execute('DELETE FROM plans');
        await pool.execute('DELETE FROM services');
        await pool.execute('DELETE FROM settings');
        await pool.execute('DELETE FROM clients');
        await pool.execute('DELETE FROM barbers');
        
        console.log('API: Todos os dados foram resetados com sucesso.');
        res.status(200).json({ message: 'Todos os dados foram resetados com sucesso.' });
    } catch (error) {
        console.error('API: Erro ao resetar dados:', error);
        res.status(500).json({ error: 'Erro no servidor ao resetar dados.' });
    }
});


// ----------------------------------------
// --- INICIAÇÃO DO SERVIDOR ---
// ----------------------------------------
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
