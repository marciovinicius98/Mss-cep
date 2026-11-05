import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import cepRoutes from './src/routes/cep.js';


const app = express();

// Middlewares essenciais 

app.use(cors());
app.use(express.json());

app.use('/api', cepRoutes);

//Rota de teste simples (health Check)

app.get('/', (req,res) => {
    res.json({ status: 'ok', mensagem: 'Microserviço Mss-CEP operante!'});
}); 

//Espaço reservado para as rotas modulares que criaremos depois
// app.use('/api', rotasDeCep);

// Configuração de porta
const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}); 