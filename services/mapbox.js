
import axios from 'axios';

export async function obterCoordenadas(endereco) {
    try {
        const resposta = await axios.get(
            'https://api.mapbox.com/search/geocode/v6/forward',
            {
                params: {
                    q: endereco,
                    access_token: process.env.MAPBOX_TOKEN,
                    country: 'BR',
                    language: 'pt',
                    limit: 1
                }
            }
        );

        const resultado = resposta.data.features[0];

        if (!resultado) {
            return null;
        }

        return {
            longitude: resultado.properties.coordinates.longitude,
            latitude: resultado.properties.coordinates.latitude
        };

    } catch (error) {
        console.error('Erro na geocodificação Mapbox:', error.message);

        throw new Error(
            'Não foi possível obter as coordenadas do endereço.'
        );
    }
}
