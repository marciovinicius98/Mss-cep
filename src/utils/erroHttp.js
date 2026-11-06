export function erroHttp(statusCode, mensagem) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}
