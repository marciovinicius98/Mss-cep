import express from 'express';
import { buscarEndereco } from '../services/viacep.js';
import { obterCoordenadas } from '../services/mapbox.js';
import { calcularDistanciaLinhaReta } from '../services/distancia.js';
import { cepValido } from '../utils/validarCep.js';

const router = express.Router();

function erroHttp(statusCode, mensagem) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

function montarEnderecoCompleto(endereco) {
    return `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, Brasil`;
}

router.post('/distancia', async (req, res) => {
    try {
        const { cepOrigem, cepDestino } = req.body ?? {};

        if (!cepValido(cepOrigem) || !cepValido(cepDestino)) {
            throw erroHttp(400, "Os campos 'cepOrigem' e 'cepDestino' devem conter exatamente 8 números (como texto).");
        }

        if (cepOrigem === cepDestino) {
            throw erroHttp(400, 'Os CEPs de origem e destino devem ser diferentes.');
        }

        const [enderecoOrigem, enderecoDestino] = await Promise.all([
            buscarEndereco(cepOrigem),
            buscarEndereco(cepDestino)
        ]);

        const [coordenadasOrigem, coordenadasDestino] = await Promise.all([
            obterCoordenadas(montarEnderecoCompleto(enderecoOrigem)),
            obterCoordenadas(montarEnderecoCompleto(enderecoDestino))
        ]);

        if (!coordenadasOrigem || !coordenadasDestino) {
            throw erroHttp(422, 'Não foi possível localizar as coordenadas de um dos endereços.');
        }

        const distanciaLinhaRetaKm = calcularDistanciaLinhaReta(
            coordenadasOrigem.latitude,
            coordenadasOrigem.longitude,
            coordenadasDestino.latitude,
            coordenadasDestino.longitude
        );

        return res.status(200).json({
            cepOrigem,
            cepDestino,
            enderecoOrigem,
            enderecoDestino,
            distanciaLinhaRetaKm
        });
    } catch (error) {
        const status = error.statusCode || 500;
        const mensagem = error.statusCode
            ? error.message
            : 'Erro interno no servidor.';

        if (!error.statusCode) {
            console.error('Erro em POST /api/distancia:', error);
        }

        return res.status(status).json({ error: true, mensagem });
    }
});

export default router;
