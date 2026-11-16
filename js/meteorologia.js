async function consultarMeteorologia() {

    const localidade = document
        .getElementById("localidade")
        .value
        .trim();

    const resultado = document.getElementById(
        "resultado-meteorologia"
    );

    // Verificar se foi escrita uma localidade
    if (localidade === "") {
        resultado.textContent = "Escreve primeiro uma localidade.";
        return;
    }

    resultado.textContent = "A consultar a meteorologia...";

    try {

        // 1. Procurar as coordenadas da localidade
        const respostaLocalidade = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(localidade)}&count=1&language=pt&format=json`
        );

        if (!respostaLocalidade.ok) {
            throw new Error("Não foi possível procurar a localidade.");
        }

        const dadosLocalidade = await respostaLocalidade.json();

        if (!dadosLocalidade.results ||
            dadosLocalidade.results.length === 0) {

            resultado.textContent = "Localidade não encontrada.";
            return;
        }

        const lugar = dadosLocalidade.results[0];

        const latitude = lugar.latitude;
        const longitude = lugar.longitude;

        // 2. Consultar a previsão meteorológica
        const respostaTempo = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_probability_max,precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
        );

        if (!respostaTempo.ok) {
            throw new Error("Não foi possível obter a previsão.");
        }

        const dadosTempo = await respostaTempo.json();

        const atual = dadosTempo.current;
        const previsao = dadosTempo.daily;

        // 3. Apresentar os dados no site
        resultado.innerHTML = "";

        const titulo = document.createElement("h4");
        titulo.textContent =
            lugar.name + ", " + (lugar.country || "");

        resultado.appendChild(titulo);

        const temperatura = document.createElement("p");
        temperatura.textContent =
            "Temperatura atual: " +
            atual.temperature_2m + " °C";

        resultado.appendChild(temperatura);

        const humidade = document.createElement("p");
        humidade.textContent =
            "Humidade do ar: " +
            atual.relative_humidity_2m + "%";

        resultado.appendChild(humidade);

        const chuvaAtual = document.createElement("p");
        chuvaAtual.textContent =
            "Precipitação atual: " +
            atual.precipitation + " mm";

        resultado.appendChild(chuvaAtual);

        const subtitulo = document.createElement("h5");
        subtitulo.className = "mt-4";
        subtitulo.textContent = "Previsão para os próximos 3 dias";

        resultado.appendChild(subtitulo);

        // 4. Percorrer os três dias da previsão
        for (let i = 0; i < previsao.time.length; i++) {

            const cartao = document.createElement("div");
            cartao.className = "card p-3 mb-2";

            const data = document.createElement("strong");
            data.textContent = previsao.time[i];

            const temperaturas = document.createElement("p");
            temperaturas.textContent =
                "Temperatura: " +
                previsao.temperature_2m_min[i] + " °C a " +
                previsao.temperature_2m_max[i] + " °C";

            const probabilidade = document.createElement("p");
            probabilidade.textContent =
                "Probabilidade de chuva: " +
                previsao.precipitation_probability_max[i] + "%";

            cartao.appendChild(data);
            cartao.appendChild(temperaturas);
            cartao.appendChild(probabilidade);

            resultado.appendChild(cartao);
        }

        // 5. Dar uma indicação simples sobre a rega
        const probabilidadeHoje =
            previsao.precipitation_probability_max[0];

        const conselho = document.createElement("div");
        conselho.className = "alert alert-success mt-3";

        if (probabilidadeHoje >= 60) {

            conselho.textContent =
                "Existe uma probabilidade elevada de chuva. " +
                "Antes de regares as plantas do exterior, " +
                "verifica se a terra já está húmida.";

        } else {

            conselho.textContent =
                "A probabilidade de chuva é reduzida. " +
                "Verifica a humidade da terra antes de regares.";

        }

        resultado.appendChild(conselho);

    } catch (erro) {

        resultado.textContent =
            "Ocorreu um erro: " + erro.message;

        console.error("Erro na meteorologia:", erro);
    }
}