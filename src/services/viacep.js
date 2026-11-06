import axios from 'axios';

const VIACEP_URL = 'https://viacep.com.br/ws';
const TIMEOUT_MS = 5000;

export async function buscarEndereco(cep) {
    try {
        const { data } = await axios.get(`${VIACEP_URL}/${cep}/json/`, { timeout: TIMEOUT_MS });

        if (data.erro) {
            const erro = new Error('CEP não encontrado.');
            erro.statusCode = 404;
            throw erro;
        }
        return {
            cep: data.cep,
            logradouro: data.logradouro,
            complemento: data.complemento,
            bairro: data.bairro,
            localidade: data.localidade,
            uf: data.uf,
        };
    } catch (error) {
        // Erro de negócio já tratado: repassa intacto
        if (error.statusCode) throw error;

        console.error('Erro na consulta ao ViaCEP:', error.message);

        const erro = new Error('Erro ao consultar o CEP. Tente novamente mais tarde.');
        erro.statusCode = 502;
        throw erro;

    }
}