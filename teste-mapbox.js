
import 'dotenv/config';
import { obterCoordenadas } from './src/services/mapbox.js';

const coordenadas = await obterCoordenadas(
    'Praça da Sé, São Paulo, SP, Brasil'
);

console.log('Coordenadas encontradas:', coordenadas);
