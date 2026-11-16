
// ==================================
// CATÁLOGO DE PLANTAS DE DEMONSTRAÇÃO
// ==================================

let plantas = [
    {
        id: 1,
        apiId: "demo-1",
        nome: "Espada-de-São-Jorge",
        nomeCientifico: "Dracaena trifasciata",
        categoria: "Asparagaceae",
        dificuldade: "Fácil",
        imagem: "img/planta-placeholder.jpg",
        detalhes: {
            common_name: "Espada-de-São-Jorge",
            scientific_name: ["Dracaena trifasciata"],
            watering: "Regar moderadamente, deixando o solo secar entre regas.",
            sunlight: "Luz indireta ou meia-sombra.",
            care_level: "Fácil",
            poisonous_to_pets: true,
            description: "Planta resistente e fácil de cuidar. Adapta-se a diferentes condições de luminosidade e necessita de pouca água.",
            default_image: { medium_url: "img/planta-placeholder.jpg" },
            demo: true
        }
    },
    {
        id: 2,
        apiId: "demo-2",
        nome: "Jiboia",
        nomeCientifico: "Epipremnum aureum",
        categoria: "Araceae",
        dificuldade: "Fácil",
        imagem: "img/planta-placeholder.jpg",
        detalhes: {
            common_name: "Jiboia",
            scientific_name: ["Epipremnum aureum"],
            watering: "Regar quando a camada superficial do solo estiver seca.",
            sunlight: "Luz indireta.",
            care_level: "Fácil",
            poisonous_to_pets: true,
            description: "Planta trepadeira de interior, conhecida pelas suas folhas verdes e pelo crescimento pendente.",
            default_image: { medium_url: "img/planta-placeholder.jpg" },
            demo: true
        }
    },
    {
        id: 3,
        apiId: "demo-3",
        nome: "Lírio-da-paz",
        nomeCientifico: "Spathiphyllum wallisii",
        categoria: "Araceae",
        dificuldade: "Moderada",
        imagem: "img/planta-placeholder.jpg",
        detalhes: {
            common_name: "Lírio-da-paz",
            scientific_name: ["Spathiphyllum wallisii"],
            watering: "Manter o solo ligeiramente húmido, sem encharcar.",
            sunlight: "Luz indireta e meia-sombra.",
            care_level: "Moderada",
            poisonous_to_pets: true,
            description: "Planta ornamental de interior com folhas verdes e flores brancas. Prefere ambientes húmidos e luz indireta.",
            default_image: { medium_url: "img/planta-placeholder.jpg" },
            demo: true
        }
    },
    {
        id: 4,
        apiId: "demo-4",
        nome: "Monstera",
        nomeCientifico: "Monstera deliciosa",
        categoria: "Araceae",
        dificuldade: "Moderada",
        imagem: "img/planta-placeholder.jpg",
        detalhes: {
            common_name: "Monstera",
            scientific_name: ["Monstera deliciosa"],
            watering: "Regar quando a superfície do solo começar a secar.",
            sunlight: "Luz indireta abundante.",
            care_level: "Moderada",
            poisonous_to_pets: true,
            description: "Planta tropical reconhecida pelas suas folhas grandes e recortadas. Desenvolve-se bem em espaços interiores luminosos.",
            default_image: { medium_url: "img/planta-placeholder.jpg" },
            demo: true
        }
    }
];
