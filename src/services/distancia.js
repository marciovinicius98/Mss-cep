export function calcularDistanciaLinhaReta(
    latitudeOrigem,
    longitudeOrigem,
    latitudeDestino,
    longitudeDestino
) {
    const raioTerra = 6371;

    const grausParaRadianos = (graus) => {
        return graus * (Math.PI / 180);
    };

    const diferencaLatitude = grausParaRadianos(
        latitudeDestino - latitudeOrigem
    );

    const diferencaLongitude = grausParaRadianos(
        longitudeDestino - longitudeOrigem
    );

    const latOrigem = grausParaRadianos(latitudeOrigem);
    const latDestino = grausParaRadianos(latitudeDestino);

    const a = 
        Math.sin(diferencaLatitude / 2) ** 2 +
        Math.cos(latOrigem) *
        Math.cos(latDestino) *
        Math.sin(diferencaLongitude / 2) **2;
        
        const c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

        const distancia = raioTerra* c; 
        return Number(distancia.toFixed(2));


}
