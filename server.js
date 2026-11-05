import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express();

// Middlewares essenciais 

app.use(cors());
app.use(express.json());

//Rota de teste simples (health Check)

app.get('/', (req,res) => {
    res.json({ status: 'ok', mensagem: 'Microserviço Mss-CEP operante!'});
}); 

//Espaço reservado para as rotas modulares que criaremos depois
// app.use('/api', rotasDeCep);

// Configuração de porta