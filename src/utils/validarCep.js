export function cepValido(cep) {
    return typeof cep === 'string' && /^\d{8}$/.test(cep);
}
