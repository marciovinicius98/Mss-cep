export function rotaNaoEncontrada(req, res) {
    return res.status(404).json({
        error: true,
        mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
}

// Middleware de erro: precisa dos 4 parâmetros para o Express reconhecê-lo
export function tratarErro(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const status = error.statusCode || 500;
    const mensagem = error.statusCode
        ? error.message
        : 'Erro interno no servidor.';

    if (!error.statusCode) {
        console.error(`Erro não tratado em ${req.method} ${req.originalUrl}:`, error);
    }

    return res.status(status).json({ error: true, mensagem });
}
