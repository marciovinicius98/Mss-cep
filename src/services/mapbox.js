
import axios from 'axios';

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/search/geocode/v6/forward';
const TIMEOUT_MS = 5000;

export async function obterCoordenadas(endereco) {
    try {
        const { data } = await axios.get(MAPBOX_GEOCODING_URL, {
            params: {
                q: endereco,
                access_token: process.env.MAPBOX_TOKEN,
                country: 'br',
                language: 'pt',
                limit: 1
            },
            timeout: TIMEOUT_MS
        });

        const resultado = data.features[0];

        if (!resultado) {
            return null;
        }

        return {
            longitude: resultado.properties.coordinates.longitude,
            latitude: resultado.properties.coordinates.latitude
        };

    } catch (error) {
        console.error('Erro na geocodificação Mapbox:', error.message);

        const erro = new Error('Não foi possível obter as coordenadas do endereço.');
        erro.statusCode = 502;
        throw erro;
    }
}
