// Controlar as páginas de plantas carregadas
let paginaPlantas = 1;
let existemMaisPlantas = true;

// Tradução dos nomes comuns das plantas
const nomesPlantasPT = {
    "snake plant": "Espada-de-São-Jorge",
    "peace lily": "Lírio-da-paz",
    "spider plant": "Planta-aranha",
    "aloe vera": "Aloe vera",
    "monstera": "Costela-de-adão",
    "jade plant": "Planta-jade",
    "english ivy": "Hera",
    "rubber plant": "Figueira-borracha",
    "basil": "Manjericão",
    "rosemary": "Alecrim",
    "lavender": "Lavanda",
    "mint": "Hortelã",
    "sunflower": "Girassol"
};

// Tradução dos níveis de dificuldade
function traduzirDificuldade(dificuldade) {
    if (!dificuldade) {
        return "Não indicada";
    }

    const valor = String(dificuldade).trim().toLowerCase();

    const traducoes = {
        "easy": "Fácil",
        "moderate": "Moderada",
        "medium": "Moderada",
        "hard": "Difícil",
        "difficult": "Difícil",
        "high": "Difícil",
        "expert": "Especializada"
    };

    return traducoes[valor] || dificuldade;
}

async function carregarPlantasAPI() {

    const resultado = document.getElementById("resultado-api");
    const botaoMais = document.getElementById("carregar-mais");

    if (resultado) {
        resultado.textContent = "A carregar plantas...";
    }

    try {

        const resposta = await fetch(
            `https://perenual.com/api/v2/species-list?key=${API_KEY}&page=${paginaPlantas}&indoor=1`
        );

        if (!resposta.ok) {
            throw new Error("Erro na ligação: " + resposta.status);
        }

        const dados = await resposta.json();

        // Confirmar que recebemos uma lista de plantas
        if (!Array.isArray(dados.data)) {
            throw new Error("Não foi recebida uma lista de plantas.");
        }

        console.log("Dificuldades recebidas da API:",
            dados.data.map(item => ({
                nome: item.common_name,
                dificuldade: item.care_level
            }))
        );

        // Converter os dados recebidos
        const novasPlantas = dados.data.map(planta => {

            const nomeOriginal = planta.common_name
                ? planta.common_name.charAt(0).toUpperCase() + planta.common_name.slice(1)
                : "";

            const nomeTraduzido =
                nomesPlantasPT[nomeOriginal.toLowerCase()] || nomeOriginal;

            return {
                id: "api-" + planta.id,
                apiId: planta.id,
                nome: nomeTraduzido || planta.scientific_name?.[0] || "Planta sem nome",
                nomeCientifico: planta.scientific_name?.[0] || "Não disponível",
                categoria: planta.family || "Não indicada",
                dificuldade: traduzirDificuldade(planta.care_level),
                imagem: planta.default_image?.medium_url ||
                    planta.default_image?.small_url || ""
            };
        });

        // Na primeira página, substituir a lista.
        // Nas seguintes, acrescentar as novas plantas.
        if (paginaPlantas === 1) {
            plantas = novasPlantas;
        } else {
            plantas = [...plantas, ...novasPlantas];
        }

        // Guardar o catálogo no navegador
        try {
            localStorage.setItem(
                "catalogoPlantas",
                JSON.stringify(plantas)
            );
        } catch (erro) {
            console.error("Não foi possível guardar o catálogo:", erro);
        }

        // Recuperar dificuldades guardadas no navegador
        carregarDificuldadesPlantas();

        // Verificar se existem mais páginas
        if (dados.meta) {
            existemMaisPlantas =
                dados.meta.current_page < dados.meta.last_page;
        } else {
            existemMaisPlantas = novasPlantas.length > 0;
        }

        if (resultado) {
            resultado.textContent =
                "Total de plantas carregadas: " + plantas.length;
        }

        preencherFiltros();
        filtrarPlantas();
        mostrarDetalhesJardim();

        // Mostrar ou esconder o botão
        if (botaoMais) {
            botaoMais.style.display =
                existemMaisPlantas ? "block" : "none";
        }

        console.log("Plantas carregadas:", plantas);
        return true;

    
    } catch (erro) {

        console.error("Erro ao carregar plantas da API:", erro);

        // Usar o catálogo de demonstração já definido em plantas.js
        if (Array.isArray(plantas) && plantas.length > 0) {

            preencherFiltros();
            filtrarPlantas();
            mostrarDetalhesJardim();

            if (resultado) {
                resultado.textContent =
                    "A apresentar catálogo de demonstração. A API não está disponível.";
            }

            existemMaisPlantas = false;

            if (botaoMais) {
                botaoMais.style.display = "none";
            }

            console.log("Catálogo de demonstração carregado:", plantas);

            return true;

        } else {

            if (resultado) {
                resultado.textContent =
                    "Não foi possível carregar o catálogo de plantas.";
            }

            return false;
        }
    }
}


// Controlar se já existe um carregamento em curso
let aCarregarMaisPlantas = false;


// Carregar a página seguinte
async function carregarMaisPlantas() {

    if (!existemMaisPlantas || aCarregarMaisPlantas) {
        return;
    }

    const botaoMais = document.getElementById("carregar-mais");

    aCarregarMaisPlantas = true;

    // Guardar o texto original do botão
    const textoOriginal = botaoMais
        ? botaoMais.textContent
        : "";

    if (botaoMais) {
        botaoMais.disabled = true;
        botaoMais.textContent = "A carregar...";
    }

    // Guardar o número da página atual
    const paginaAnterior = paginaPlantas;

    try {

        paginaPlantas++;

        const sucesso = await carregarPlantasAPI();

        if (!sucesso) {
            paginaPlantas = paginaAnterior;
        }

    } finally {

        aCarregarMaisPlantas = false;

        if (botaoMais) {
            botaoMais.disabled = false;
            botaoMais.textContent = textoOriginal;
        }

    }
}

// Traduzir a frequência de rega
function traduzirRega(rega) {

    const traducoes = {
        "frequent": "Frequente",
        "average": "Moderada",
        "minimum": "Mínima",
        "none": "Não necessita de rega regular"
    };

    return traducoes[rega?.toLowerCase()] || rega || "Informação não disponível";
}


// Traduzir a exposição solar
function traduzirLuz(luz) {

    const traducoes = {
        "full sun": "Sol pleno",
        "part shade": "Meia-sombra",
        "full shade": "Sombra",
        "filtered shade": "Sombra filtrada"
    };

    return traducoes[luz?.toLowerCase()] || luz;
}


// Traduzir descrições de inglês para português
async function traduzirDescricao(texto) {

    if (!texto || !texto.trim()) {
        return "Não existe descrição disponível.";
    }

    try {

        const resposta = await fetch(
            "https://libretranslate.com/translate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    q: texto,
                    source: "en",
                    target: "pt",
                    format: "text"
                })
            }
        );

        if (!resposta.ok) {
            throw new Error("Serviço de tradução indisponível.");
        }

        const dados = await resposta.json();

        if (
            !dados.translatedText ||
            !dados.translatedText.trim()
        ) {
            throw new Error("A tradução não foi recebida.");
        }

        return dados.translatedText;

    } catch (erro) {

        console.error("Erro na tradução:", erro);

        // Se a tradução falhar, apresentar o texto original
        return texto;
    }
}


async function verDetalhesPlanta(id) {

    const carregamento = document.getElementById("carregamento-detalhes");
    const conteudo = document.getElementById("conteudo-detalhes");

    // Abrir a janela
    const modalElemento = document.getElementById("modalPlanta");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);

    modal.show();


    // Verificar se é uma planta de demonstração
    const plantaDemo = plantas.find(
        p => String(p.apiId) === String(id) && p.detalhes?.demo
    );

    if (plantaDemo) {

        const dados = plantaDemo.detalhes;

        document.getElementById("titulo-modal").textContent =
            dados.common_name;

        document.getElementById("cientifico-modal").textContent =
            dados.scientific_name[0];

        document.getElementById("rega-modal").textContent =
            dados.watering;

        document.getElementById("luz-modal").textContent =
            dados.sunlight;

        document.getElementById("dificuldade-modal").textContent =
            dados.care_level;

        const aviso = document.getElementById("toxicidade-modal");

        aviso.className = "alert";

        if (dados.poisonous_to_pets) {
            aviso.classList.add("alert-danger");
            aviso.textContent =
                "Atenção! Esta planta é tóxica para animais de estimação.";
        } else {
            aviso.classList.add("alert-success");
            aviso.textContent =
                "Esta planta não é tóxica para animais de estimação.";
        }

        document.getElementById("descricao-modal").textContent =
            dados.description;

        const imagem = document.getElementById("imagem-modal");

        imagem.src = dados.default_image.medium_url;
        imagem.alt = dados.common_name;
        imagem.style.display = "block";

        carregamento.style.display = "none";
        conteudo.style.display = "block";

        return;
    }


    carregamento.style.display = "block";
    carregamento.textContent = "A carregar informação...";
    conteudo.style.display = "none";

    try {
        let planta;

        // Recuperar detalhes guardados
        let detalhesGuardados = {};

        try {
            detalhesGuardados =
                JSON.parse(localStorage.getItem("detalhesPlantas")) || {};
        } catch (erro) {
            detalhesGuardados = {};
        }

        // Verificar se já temos os detalhes desta planta
        if (detalhesGuardados[id]) {

            planta = detalhesGuardados[id];

        } else {

            // Consultar a API apenas se ainda não existirem dados guardados
            const resposta = await fetch(
                `https://perenual.com/api/v2/species/details/${id}?key=${API_KEY}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao consultar a planta: " + resposta.status);
            }


            planta = await resposta.json();

            // Guardar apenas os dados utilizados no modal
            const detalhesReduzidos = {
                common_name: planta.common_name,
                scientific_name: planta.scientific_name,
                watering: planta.watering,
                sunlight: planta.sunlight,
                care_level: planta.care_level,
                poisonous_to_pets: planta.poisonous_to_pets,
                description: planta.description,
                default_image: planta.default_image
            };

            // Guardar os detalhes reduzidos para utilizações futuras
            detalhesGuardados[id] = detalhesReduzidos;


            try {
                localStorage.setItem(
                    "detalhesPlantas",
                    JSON.stringify(detalhesGuardados)
                );
            } catch (erro) {
                console.error("Não foi possível guardar os detalhes:", erro);
            }
        }

        // Atualizar a dificuldade da planta no catálogo
        const plantaCatalogo = plantas.find(
            p => String(p.apiId) === String(id)
        );

        if (plantaCatalogo && planta.care_level) {

            plantaCatalogo.dificuldade =
                traduzirDificuldade(planta.care_level);

            // Guardar a dificuldade na memória do navegador
            try {

                const dificuldadesGuardadas =
                    JSON.parse(localStorage.getItem("dificuldadesPlantas")) || {};

                dificuldadesGuardadas[id] = plantaCatalogo.dificuldade;

                localStorage.setItem(
                    "dificuldadesPlantas",
                    JSON.stringify(dificuldadesGuardadas)
                );

            } catch (erro) {
                console.error("Erro ao guardar a dificuldade:", erro);
            }

            // Atualizar os resultados do catálogo
            filtrarPlantas();
        }

        // Preencher os dados
        document.getElementById("titulo-modal").textContent =
            planta.common_name || "Detalhes da planta";

        document.getElementById("cientifico-modal").textContent =
            planta.scientific_name?.[0] || "Não disponível";

        document.getElementById("rega-modal").textContent =
            traduzirRega(planta.watering);

        document.getElementById("luz-modal").textContent =
            Array.isArray(planta.sunlight)
                ? planta.sunlight.map(traduzirLuz).join(", ")
                : "Informação não disponível";

        document.getElementById("dificuldade-modal").textContent =
            traduzirDificuldade(planta.care_level);

        const avisoToxicidade = document.getElementById("toxicidade-modal");

        avisoToxicidade.className = "alert";

        if (
            planta.poisonous_to_pets === true ||
            planta.poisonous_to_pets === 1
        ) {
            avisoToxicidade.classList.add("alert-danger");

            avisoToxicidade.textContent =
                "Atenção! A Perenual indica que esta planta é tóxica para animais de estimação.";

        } else if (
            planta.poisonous_to_pets === false ||
            planta.poisonous_to_pets === 0
        ) {
            avisoToxicidade.classList.add("alert-success");

            avisoToxicidade.textContent =
                "A Perenual indica que esta planta não é tóxica para animais de estimação.";

        } else {
            avisoToxicidade.classList.add("alert-warning");

            avisoToxicidade.textContent =
                "Toxicidade desconhecida. Não existem dados suficientes para confirmar se esta planta é segura para animais.";
        }

        document.getElementById("descricao-modal").textContent =
            planta.description || "Não existe descrição disponível.";

        // Mostrar imagem, se existir
        const imagem = document.getElementById("imagem-modal");

        if (planta.default_image?.medium_url) {
            imagem.src = planta.default_image.medium_url;
            imagem.alt = planta.common_name || "Imagem da planta";
            imagem.style.display = "block";
        } else {
            imagem.style.display = "none";
        }

        carregamento.style.display = "none";
        conteudo.style.display = "block";

    } catch (erro) {

        carregamento.textContent =
            "Não foi possível carregar os detalhes: " + erro.message;

        console.error(erro);
    }
}


function carregarDificuldadesPlantas() {

    const chaveCache = "dificuldadesPlantas";

    let dificuldadesGuardadas = {};

    // Recuperar dificuldades guardadas
    try {
        dificuldadesGuardadas =
            JSON.parse(localStorage.getItem(chaveCache)) || {};
    } catch (erro) {
        dificuldadesGuardadas = {};
    }

    // Aplicar as dificuldades às plantas do catálogo
    plantas.forEach(planta => {

        if (planta.apiId && dificuldadesGuardadas[planta.apiId]) {

            planta.dificuldade =
                dificuldadesGuardadas[planta.apiId];

        }

    });

    preencherFiltros();
    filtrarPlantas();
}