import express from 'express';
import axios from 'axios';

const router = express.Router();

// Consulta e validação de CEP
router.get('/cep/:cep', async (req, res) => {

    try {
        // Recebe o CEP enviado pela URL
        const { cep } = req.params;

        // Verifica se o EP possui exatamente 8 números
        if (!/^\d{8}$/.test(cep)) {
            return res.status(400).json({ error: true, mensagem:'CEP inválido. O CEP deve conter exatamente 8 números.' });
        }

        // Consulta o CEP na API ViaCEP
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        // Verifica se o CEP exite
        if (resposta.data.erro) {
            return res.status(404).json({ error: true, mensagem: 'CEP não encontrado.' });
        }

        //Retorna os dados do endereço
        return res.status(200).json(resposta.data);
    } catch (error) {
        console.error('Erro ao consultar o cep:', error.mensagem);

        return res.status(502).json({ error: true, mensagem: 'Erro ao consultar o CEP. Tente novamente mais tarde.' });
    }
});

export default router;
