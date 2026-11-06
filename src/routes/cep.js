import express from 'express';
import { buscarEndereco } from '../services/viacep.js';
import { cepValido } from '../utils/validarCep.js';

const router = express.Router();

// Consulta e validação de CEP
router.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params;

    // Validação de entrada: responsabilidade da rota
    if (!cepValido(cep)) {
        return res.status(400).json({
            error: true,
            mensagem: 'CEP inválido. O CEP deve conter exatamente 8 números.'
        });
    }

    try {
        const endereco = await buscarEndereco(cep);
        return res.status(200).json(endereco);
    } catch (error) {
        const status = error.statusCode || 500;
        const mensagem = error.statusCode
            ? error.message
            : 'Erro interno no servidor.';

        return res.status(status).json({ error: true, mensagem });
    }
});

export default router;