
import 'dotenv/config';
import { obterCoordenadas } from './services/MAPBOX.JS';

const coordenadas = await obterCoordenadas(
    'Praça da Sé, São Paulo, SP, Brasil'
);

console.log('Coordenadas encontradas:', coordenadas);
