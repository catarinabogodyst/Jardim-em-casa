
/* ==================================
   O MEU JARDIM
   Gestão de vários jardins
================================== */

// Recuperar os jardins guardados no navegador
let jardins = JSON.parse(
    localStorage.getItem("jardins")
) || [];

// Guardar o jardim atualmente selecionado
let jardimAtual = localStorage.getItem("jardimAtual") || "";


/* ==================================
   GUARDAR OS DADOS
================================== */

function guardarJardins() {

    localStorage.setItem(
        "jardins",
        JSON.stringify(jardins)
    );

    localStorage.setItem(
        "jardimAtual",
        jardimAtual
    );
}


/* ==================================
   CRIAR UM JARDIM
================================== */

function criarJardim() {

    const campoNome = document.getElementById("nome-jardim");

    const nome = campoNome.value.trim();

    // Verificar se o utilizador escreveu um nome
    if (nome === "") {

        alert("Por favor, escreve o nome do jardim!");

        return;
    }

    // Verificar se já existe um jardim com esse nome
    const existe = jardins.some(jardim =>
        jardim.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existe) {

        alert("Já existe um jardim com esse nome!");

        return;
    }

    // Criar um novo objeto jardim
    const novoJardim = {

        id: Date.now(),

        nome: nome,

        plantas: []

    };

    // Adicionar o jardim ao array
    jardins.push(novoJardim);

    // Selecionar automaticamente o novo jardim
    jardimAtual = String(novoJardim.id);

    // Guardar os dados
    guardarJardins();

    // Limpar o campo de texto
    campoNome.value = "";

    // Atualizar o website
    mostrarJardins();

    //
    mostrarPlantas();

}


/* ==================================
   MOSTRAR OS JARDINS
================================== */

function mostrarJardins() {

    const seletor = document.getElementById("seletor-jardins");

    seletor.innerHTML = "";

    // Verificar se existem jardins
    if (jardins.length === 0) {

        const opcao = document.createElement("option");

        opcao.value = "";

        opcao.textContent = "Ainda não existem jardins";

        seletor.appendChild(opcao);

        jardimAtual = "";

        guardarJardins();

        mostrarDetalhesJardim();

        return;
    }

    // Percorrer todos os jardins
    jardins.forEach(jardim => {

        const opcao = document.createElement("option");

        opcao.value = jardim.id;

        opcao.textContent = jardim.nome;

        seletor.appendChild(opcao);

    });

    // Verificar se o jardim selecionado ainda existe
    const jardimExiste = jardins.some(
        jardim => String(jardim.id) === jardimAtual
    );

    if (!jardimExiste) {

        jardimAtual = String(jardins[0].id);

    }

    seletor.value = jardimAtual;

    guardarJardins();

    mostrarDetalhesJardim();

}


/* ==================================
   SELECIONAR UM JARDIM
================================== */

function selecionarJardim() {

    const seletor = document.getElementById("seletor-jardins");

    jardimAtual = seletor.value;

    guardarJardins();

    mostrarDetalhesJardim();

}


/* ==================================
   MOSTRAR DETALHES DO JARDIM
================================== */

function mostrarDetalhesJardim() {

    const area = document.getElementById("informacao-jardim");
    const botaoApagar = document.getElementById("apagar-jardim");

    const jardim = jardins.find(
        jardim => String(jardim.id) === jardimAtual
    );

    if (!jardim) {

        area.innerHTML = `
            <div class="text-center p-4">
                <h5>O teu jardim está à tua espera!</h5>
                <p class="text-muted">
                    Cria o teu primeiro jardim e começa a adicionar plantas.
                </p>
            </div>
        `;

        botaoApagar.style.display = "none";
        return;
    }

    botaoApagar.style.display = "block";

    // Título e contador de plantas
    area.innerHTML = `
        <div class="mb-4">
            <h4 class="text-success">${jardim.nome}</h4>
            <span class="badge bg-success">
                ${jardim.plantas.length} plantas
            </span>
        </div>

        <div id="plantas-do-jardim"></div>
    `;

    const lista = document.getElementById("plantas-do-jardim");

    if (jardim.plantas.length === 0) {

        lista.innerHTML = `
            <div class="alert alert-light border text-center">
                <h6>O teu jardim ainda está vazio!</h6>
                <p class="mb-0 text-muted">
                    Visita o catálogo e adiciona as tuas primeiras plantas.
                </p>
            </div>
        `;

        return;
    }

    // Percorrer as plantas do jardim
    jardim.plantas.forEach(id => {

        const planta = plantas.find(p => p.id === id);

        if (planta) {

            const elemento = document.createElement("div");

            elemento.className =
                "border rounded p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center";

            const nome = document.createElement("strong");
            nome.textContent = planta.nome;
            nome.className = "nome-planta";

            const botao = document.createElement("button");

            botao.className = "btn btn-sm btn-outline-danger";
            botao.textContent = "Remover";

            botao.onclick = function () {
                removerPlanta(jardim.id, planta.id);
            };

            elemento.appendChild(nome);
            elemento.appendChild(botao);

            lista.appendChild(elemento);
        }

    });

}


/* ==================================
   APAGAR UM JARDIM
================================== */

function apagarJardim() {

    const confirmar = confirm(
        "Tens a certeza de que queres apagar este jardim?"
    );

    if (!confirmar) {

        return;

    }

    // Remover o jardim selecionado
    jardins = jardins.filter(
        jardim => String(jardim.id) !== jardimAtual
    );

    jardimAtual = jardins.length > 0
        ? String(jardins[0].id)
        : "";

    guardarJardins();

    mostrarJardins();

    mostrarPlantas();

}


/* ==================================
   INICIALIZAR O WEBSITE
================================== */

mostrarJardins();


// ==================================
// MOSTRAR O CATÁLOGO
// ==================================

function mostrarPlantas(lista = plantas) {
    const area = document.getElementById("lista-plantas");

    area.innerHTML = "";

    if (lista.length === 0) {
        area.textContent = "Não foram encontradas plantas.";
        return;
    }

    lista.forEach(planta => {

        // Criar a coluna
        const coluna = document.createElement("div");
        coluna.className = "col-sm-6 col-lg-4 mb-4";

        // Criar o cartão
        const cartao = document.createElement("div");
        cartao.className = "card h-100 shadow-sm border-0";

        // Adicionar imagem, se existir

        const imagem = document.createElement("img");

        imagem.src = planta.imagem || "img/planta-placeholder.jpg";
        imagem.alt = "Imagem de " + planta.nome;
        imagem.className = "card-img-top";
        imagem.style.height = "220px";
        imagem.style.objectFit = "cover";
        imagem.style.borderRadius = "8px 8px 0 0";

        // Carregar a imagem apenas quando necessário
        imagem.loading = "lazy";

        // Se a imagem não carregar, apresentar uma alternativa
        imagem.onerror = function () {
            imagem.onerror = null;
            imagem.src = "img/planta-placeholder.jpg";
        };

        cartao.appendChild(imagem);


        // Criar o corpo do cartão
        const corpo = document.createElement("div");
        corpo.className = "card-body d-flex flex-column";

        const titulo = document.createElement("h5");
        titulo.className = "card-title";
        titulo.textContent = planta.nome;

        const cientifico = document.createElement("p");
        cientifico.className = "text-muted";
        cientifico.textContent = planta.nomeCientifico;

        const familia = document.createElement("p");
        familia.textContent = "Família: " + planta.categoria;

        // Criar o seletor de jardins
        const seletor = document.createElement("select");
        seletor.className = "form-select mb-2";

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Escolhe um jardim";
        seletor.appendChild(opcaoInicial);

        jardins.forEach(jardim => {
            const opcao = document.createElement("option");
            opcao.value = jardim.id;
            opcao.textContent = jardim.nome;
            seletor.appendChild(opcao);
        });

        // Criar botão para adicionar a planta
        const botao = document.createElement("button");
        botao.className = "btn btn-success w-100";
        botao.textContent = "Adicionar ao meu jardim";

        botao.disabled = jardins.length === 0;

        botao.onclick = function () {
            if (seletor.value === "") {
                alert("Escolhe primeiro um jardim!");
                return;
            }

            adicionarPlanta(planta.id, seletor.value);
        };

        // Juntar os elementos
        corpo.appendChild(titulo);
        corpo.appendChild(cientifico);
        corpo.appendChild(familia);

        // Botão para consultar os detalhes da planta
        const botaoDetalhes = document.createElement("button");

        botaoDetalhes.className = "btn btn-outline-success w-100 mb-2";
        botaoDetalhes.textContent = "Ver cuidados e detalhes";

        botaoDetalhes.onclick = function () {
            verDetalhesPlanta(planta.apiId);
        };

        corpo.appendChild(botaoDetalhes);
        corpo.appendChild(seletor);
        corpo.appendChild(botao);
        corpo.style.gap = "8px";
        cartao.appendChild(corpo);
        coluna.appendChild(cartao);

        area.appendChild(coluna);
    });
}

// ==================================
// ADICIONAR UMA PLANTA
// ==================================

function adicionarPlanta(idPlanta, idJardim) {

    const planta = plantas.find(p => p.id === idPlanta);

    const jardim = jardins.find(
        j => String(j.id) === String(idJardim)
    );

    if (!planta || !jardim) {
        alert("Não foi possível encontrar a planta ou o jardim.");
        return;
    }

    if (jardim.plantas.includes(idPlanta)) {
        alert("Esta planta já está neste jardim!");
        return;
    }

    jardim.plantas.push(idPlanta);

    guardarJardins();

    mostrarDetalhesJardim();

    alert("Planta adicionada com sucesso!");
}

// ==================================
// REMOVER UMA PLANTA
// ==================================

function removerPlanta(idJardim, idPlanta) {

    const jardim = jardins.find(
        j => String(j.id) === String(idJardim)
    );

    if (!jardim) return;

    jardim.plantas = jardim.plantas.filter(
        id => id !== idPlanta
    );

    guardarJardins();

    mostrarDetalhesJardim();

    mostrarPlantas();

}


// ==================================
// PESQUISAR E FILTRAR PLANTAS
// ==================================

function pesquisarPlantas() {
    filtrarPlantas();
}


// ==================================
// APLICAR OS FILTROS
// ==================================

function filtrarPlantas() {

    const pesquisa = document.getElementById(
        "pesquisa-plantas"
    ).value.toLowerCase();

    const categoria = document.getElementById(
        "filtro-categoria"
    ).value;

    const dificuldade = document.getElementById(
        "filtro-dificuldade"
    ).value;

    const ordenacao = document.getElementById(
        "ordenar-plantas"
    ).value;

    // Filtrar as plantas
    const resultados = plantas.filter(planta => {

        const correspondePesquisa =
            planta.nome.toLowerCase().includes(pesquisa) ||
            planta.categoria.toLowerCase().includes(pesquisa);

        const correspondeCategoria =
            categoria === "" ||
            planta.categoria === categoria;

        const correspondeDificuldade =
            dificuldade === "" ||
            planta.dificuldade === dificuldade;

        return correspondePesquisa &&
            correspondeCategoria &&
            correspondeDificuldade;
    });

    // Ordenar os resultados
    if (ordenacao === "az") {

        resultados.sort((a, b) =>
            a.nome.localeCompare(b.nome)
        );

    } else if (ordenacao === "za") {

        resultados.sort((a, b) =>
            b.nome.localeCompare(a.nome)
        );

    }

    mostrarPlantas(resultados);
}


// ==================================
// LIMPAR OS FILTROS
// ==================================

function limparFiltros() {

    document.getElementById("pesquisa-plantas").value = "";
    document.getElementById("filtro-categoria").value = "";
    document.getElementById("filtro-dificuldade").value = "";
    document.getElementById("ordenar-plantas").value = "";

    filtrarPlantas();
}


// ==================================
// PREENCHER OS FILTROS AUTOMATICAMENTE
// ==================================

function preencherFiltros() {

    const filtroCategoria = document.getElementById(
        "filtro-categoria"
    );

    const filtroDificuldade = document.getElementById(
        "filtro-dificuldade"
    );

    filtroCategoria.innerHTML =
        '<option value="">Todas as categorias</option>';

    filtroDificuldade.innerHTML =
        '<option value="">Todas as dificuldades</option>';

    const categorias = [
        ...new Set(plantas.map(planta => planta.categoria).filter(Boolean))
    ].sort((a, b) => a.localeCompare(b));

    const dificuldades = [
        "Fácil",
        "Moderada",
        "Difícil",
        "Especializada",
        "Não indicada"
    ];

    categorias.forEach(categoria => {

        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;

        filtroCategoria.appendChild(opcao);

    });

    dificuldades.forEach(dificuldade => {

        const opcao = document.createElement("option");
        opcao.value = dificuldade;
        opcao.textContent = dificuldade;

        filtroDificuldade.appendChild(opcao);

    });

}


// ==================================
// INICIALIZAR O CATÁLOGO
// ==================================

carregarPlantasAPI();
