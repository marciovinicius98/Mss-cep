import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config'

import cepRoutes from './src/routes/cep.js';
import distanciaRoutes from './src/routes/distancia.js';
import { rotaNaoEncontrada, tratarErro } from './src/middlewares/erros.js';

// Em ES Modules não existe __dirname: derivamos do import.meta.url
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));


const app = express();

// Middlewares essenciais 

app.use(cors());
app.use(express.json());

app.use('/api', cepRoutes);
app.use('/api', distanciaRoutes);

// Dashboard estático em /app (HTML/CSS/JS puro, sem build)
app.use('/app', express.static(path.join(diretorioAtual, 'public')));

//Rota de teste simples (health Check)

app.get('/', (req,res) => {
    res.json({ status: 'ok', mensagem: 'Microserviço Mss-CEP operante!'});
}); 

//Espaço reservado para as rotas modulares que criaremos depois
// app.use('/api', rotasDeCep);

// 404 em JSON e tratamento centralizado de erros (sempre por último)
app.use(rotaNaoEncontrada);
app.use(tratarErro);

// Configuração de porta
const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}); 