import axios from 'axios';

const MATRIX_URL = 'https://api.mapbox.com/directions-matrix/v1';
const PERFIL = 'mapbox/driving';
const TIMEOUT_MS = 5000;

export async function obterRota(coordenadasOrigem, coordenadasDestino) {
    try {
        // Matrix API espera longitude,latitude — nesta ordem
        const coordinates = [
            `${coordenadasOrigem.longitude},${coordenadasOrigem.latitude}`,
            `${coordenadasDestino.longitude},${coordenadasDestino.latitude}`
        ].join(';');

        const { data } = await axios.get(`${MATRIX_URL}/${PERFIL}/${coordinates}`, {
            params: {
                annotations: 'distance,duration',
                access_token: process.env.MAPBOX_TOKEN
            },
            timeout: TIMEOUT_MS
        });

        const distanciaMetros = data.distances?.[0]?.[1];
        const duracaoSegundos = data.durations?.[0]?.[1];

        if (distanciaMetros == null || duracaoSegundos == null) {
            return null;
        }

        return {
            distanciaKm: Number((distanciaMetros / 1000).toFixed(2)),
            duracaoMin: Math.round(duracaoSegundos / 60)
        };
    } catch (error) {
        console.error('Erro na Matrix API da Mapbox:', error.message);

        const erro = new Error('Não foi possível calcular a rota entre os endereços.');
        erro.statusCode = 502;
        throw erro;
    }
}
