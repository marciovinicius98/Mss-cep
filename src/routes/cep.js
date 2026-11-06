import express from 'express';
import { buscarEndereco } from '../services/viacep.js';
import { cepValido } from '../utils/validarCep.js';
import { erroHttp } from '../utils/erroHttp.js';

const router = express.Router();

// Consulta e validação de CEP
router.get('/cep/:cep', async (req, res) => {
    const { cep } = req.params;

    if (!cepValido(cep)) {
        throw erroHttp(400, 'CEP inválido. O CEP deve conter exatamente 8 números.');
    }

    const endereco = await buscarEndereco(cep);

    return res.status(200).json(endereco);
});

export default router;