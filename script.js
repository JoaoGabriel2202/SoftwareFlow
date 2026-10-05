const etapas = [
    "Solicitação",
    "Análise",
    "Desenvolvimento",
    "Testes",
    "Aprovação",
    "Entrega"
];


const progressoEtapas = {
    "Solicitação": 10,
    "Análise": 25,
    "Desenvolvimento": 50,
    "Testes": 70,
    "Aprovação": 90,
    "Entrega": 100
};


/* =========================
   DADOS
========================= */

let projetos =
    JSON.parse(
        localStorage.getItem("softwareflow_projetos")
    ) || [

        {
            id: 1,

            nome: "Sistema de Biblioteca",

            solicitante: "Faculdade",

            responsavel: "João Gabriel",

            prioridade: "Alta",

            prazo: "2026-10-30",

            descricao:
                "Sistema para cadastro de livros, usuários, empréstimos e devoluções.",

            etapa: "Desenvolvimento"
        },

        {
            id: 2,

            nome: "Portal Acadêmico",

            solicitante: "Coordenação",

            responsavel: "Equipe SoftwareFlow",

            prioridade: "Média",

            prazo: "2026-11-15",

            descricao:
                "Portal para acompanhamento de atividades acadêmicas.",

            etapa: "Análise"
        },

        {
            id: 3,

            nome: "Controle de Estoque",

            solicitante: "Empresa Exemplo",

            responsavel: "Equipe SoftwareFlow",

            prioridade: "Baixa",

            prazo: "2026-11-25",

            descricao:
                "Sistema simples para controle de produtos.",

            etapa: "Solicitação"
        }

    ];


/* =========================
   SALVAR
========================= */

function salvarProjetos() {

    localStorage.setItem(
        "softwareflow_projetos",
        JSON.stringify(projetos)
    );

}


/* =========================
   NOTIFICAÇÃO
========================= */

function notificacao(mensagem) {

    const elemento =
        document.getElementById("notificacao");

    elemento.textContent = mensagem;

    elemento.classList.add("mostrar");


    setTimeout(() => {

        elemento.classList.remove("mostrar");

    }, 2500);

}


/* =========================
   DATA
========================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }


    return new Date(
        data + "T12:00:00"
    ).toLocaleDateString("pt-BR");

}


/* =========================
   NAVEGAÇÃO
========================= */

const informacoesPagina = {

    dashboard: {
        titulo: "Dashboard",
        subtitulo:
            "Visão geral da produção de software"
    },

    nova: {
        titulo: "Nova Solicitação",
        subtitulo:
            "Cadastre uma nova demanda"
    },

    projetos: {
        titulo: "Projetos",
        subtitulo:
            "Gerencie as solicitações da equipe"
    },

    quadro: {
        titulo: "Quadro de Produção",
        subtitulo:
            "Acompanhe o fluxo da fábrica de software"
    },

    detalhes: {
        titulo: "Detalhes do Projeto",
        subtitulo:
            "Informações da solicitação"
    }

};


function abrirPagina(pagina) {

    document
        .querySelectorAll(".pagina")
        .forEach(elemento => {

            elemento.classList.remove("ativa");

        });


    document
        .getElementById(pagina)
        .classList.add("ativa");


    document
        .querySelectorAll(".menu-item")
        .forEach(botao => {

            botao.classList.remove("active");

            if (botao.dataset.page === pagina) {

                botao.classList.add("active");

            }

        });


    document.getElementById(
        "tituloPagina"
    ).textContent =
        informacoesPagina[pagina].titulo;


    document.getElementById(
        "subtituloPagina"
    ).textContent =
        informacoesPagina[pagina].subtitulo;


    if (pagina === "dashboard") {
        atualizarDashboard();
    }

    if (pagina === "projetos") {
        atualizarTabelaProjetos();
    }

    if (pagina === "quadro") {
        atualizarKanban();
    }

}


/* BOTÕES MENU */

document
    .querySelectorAll(".menu-item")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                abrirPagina(
                    botao.dataset.page
                );

            }
        );

    });


document.getElementById(
    "btnNova"
).addEventListener(
    "click",
    () => {

        abrirPagina("nova");

    }
);


/* BOTÕES DATA-IR */

document.addEventListener(
    "click",
    evento => {

        const botao =
            evento.target.closest("[data-ir]");


        if (botao) {

            abrirPagina(
                botao.dataset.ir
            );

        }

    }
);


/* =========================
   BADGES
========================= */

function badgePrioridade(prioridade) {

    return `
        <span class="
            badge
            prioridade-${prioridade}
        ">
            ${prioridade}
        </span>
    `;

}


function badgeStatus(status) {

    return `
        <span class="badge status">
            ${status}
        </span>
    `;

}


/* =========================
   DASHBOARD
========================= */

function atualizarDashboard() {

    document.getElementById(
        "totalProjetos"
    ).textContent =
        projetos.length;


    const andamento =
        projetos.filter(projeto =>

            projeto.etapa !== "Solicitação" &&
            projeto.etapa !== "Entrega"

        ).length;


    document.getElementById(
        "emAndamento"
    ).textContent =
        andamento;


    const testes =
        projetos.filter(projeto =>

            projeto.etapa === "Testes"

        ).length;


    document.getElementById(
        "emTestes"
    ).textContent =
        testes;


    const concluidos =
        projetos.filter(projeto =>

            projeto.etapa === "Entrega"

        ).length;


    document.getElementById(
        "concluidos"
    ).textContent =
        concluidos;


    /* PROGRESSO MÉDIO */

    let progresso = 0;


    if (projetos.length > 0) {

        const total =
            projetos.reduce(
                (soma, projeto) => {

                    return soma +
                        progressoEtapas[
                            projeto.etapa
                        ];

                },
                0
            );


        progresso =
            Math.round(
                total / projetos.length
            );

    }


    document.getElementById(
        "progressoGeral"
    ).textContent =
        progresso + "%";


    document
        .querySelector(
            ".circulo-progresso"
        )
        .style.setProperty(
            "--progresso",
            progresso + "%"
        );


    atualizarGrafico();

    atualizarRecentes();

}


/* =========================
   GRÁFICO
========================= */

function atualizarGrafico() {

    const grafico =
        document.getElementById("grafico");


    const quantidades =
        etapas.map(etapa => {

            return projetos.filter(
                projeto =>
                    projeto.etapa === etapa
            ).length;

        });


    const maior =
        Math.max(
            1,
            ...quantidades
        );


    grafico.innerHTML =
        etapas.map(
            (etapa, indice) => {

                const quantidade =
                    quantidades[indice];


                const altura =
                    Math.max(
                        5,
                        quantidade /
                        maior *
                        160
                    );


                return `

                    <div class="barra-container">

                        <strong>
                            ${quantidade}
                        </strong>

                        <div
                            class="barra"
                            style="
                                height:
                                ${altura}px
                            "
                        ></div>

                        <span>
                            ${etapa}
                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   PROJETOS RECENTES
========================= */

function atualizarRecentes() {

    const tabela =
        document.getElementById(
            "tabelaRecentes"
        );


    const recentes =
        [...projetos]
            .reverse()
            .slice(0, 5);


    if (recentes.length === 0) {

        tabela.innerHTML = `

            <tr>
                <td colspan="6">
                    Nenhum projeto cadastrado.
                </td>
            </tr>

        `;

        return;
    }


    tabela.innerHTML =
        recentes.map(
            projeto => {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${projeto.nome}
                            </strong>
                        </td>

                        <td>
                            ${projeto.solicitante}
                        </td>

                        <td>
                            ${projeto.responsavel}
                        </td>

                        <td>
                            ${badgePrioridade(
                                projeto.prioridade
                            )}
                        </td>

                        <td>
                            ${badgeStatus(
                                projeto.etapa
                            )}
                        </td>

                        <td>
                            ${formatarData(
                                projeto.prazo
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================
   CADASTRAR PROJETO
========================= */

document.getElementById(
    "formProjeto"
).addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        const novoProjeto = {

            id: Date.now(),

            nome:
                document.getElementById(
                    "nome"
                ).value,

            solicitante:
                document.getElementById(
                    "solicitante"
                ).value,

            responsavel:
                document.getElementById(
                    "responsavel"
                ).value,

            prioridade:
                document.getElementById(
                    "prioridade"
                ).value,

            prazo:
                document.getElementById(
                    "prazo"
                ).value,

            descricao:
                document.getElementById(
                    "descricao"
                ).value,

            etapa:
                "Solicitação"

        };


        projetos.push(
            novoProjeto
        );


        salvarProjetos();


        evento.target.reset();


        notificacao(
            "Solicitação cadastrada com sucesso!"
        );


        abrirPagina(
            "quadro"
        );

    }
);


/* =========================
   TABELA DE PROJETOS
========================= */

function atualizarTabelaProjetos(
    pesquisa = ""
) {

    const tabela =
        document.getElementById(
            "tabelaProjetos"
        );


    const filtrados =
        projetos.filter(
            projeto => {

                const texto = `
                    ${projeto.nome}
                    ${projeto.solicitante}
                    ${projeto.responsavel}
                    ${projeto.etapa}
                `.toLowerCase();


                return texto.includes(
                    pesquisa.toLowerCase()
                );

            }
        );


    if (filtrados.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="7">
                    Nenhum projeto encontrado.
                </td>

            </tr>

        `;

        return;
    }


    tabela.innerHTML =
        filtrados.map(
            projeto => {

                return `

                    <tr>

                        <td>
                            <strong>
                                ${projeto.nome}
                            </strong>
                        </td>

                        <td>
                            ${projeto.solicitante}
                        </td>

                        <td>
                            ${projeto.responsavel}
                        </td>

                        <td>
                            ${badgePrioridade(
                                projeto.prioridade
                            )}
                        </td>

                        <td>
                            ${badgeStatus(
                                projeto.etapa
                            )}
                        </td>

                        <td>
                            ${formatarData(
                                projeto.prazo
                            )}
                        </td>

                        <td>

                            <button
                                class="btn-mini"
                                onclick="
                                    verDetalhes(
                                        ${projeto.id}
                                    )
                                "
                            >
                                Detalhes
                            </button>

                            <button
                                class="btn-mini"
                                onclick="
                                    excluirProjeto(
                                        ${projeto.id}
                                    )
                                "
                            >
                                Excluir
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* PESQUISA */

document.getElementById(
    "pesquisaProjeto"
).addEventListener(
    "input",
    evento => {

        atualizarTabelaProjetos(
            evento.target.value
        );

    }
);


/* =========================
   EXCLUIR
========================= */

function excluirProjeto(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este projeto?"
        );


    if (!confirmar) {
        return;
    }


    projetos =
        projetos.filter(
            projeto =>
                projeto.id !== id
        );


    salvarProjetos();

    atualizarTabelaProjetos();


    notificacao(
        "Projeto excluído."
    );

}


/* =========================
   KANBAN
========================= */

function atualizarKanban() {

    const kanban =
        document.getElementById(
            "kanban"
        );


    kanban.innerHTML =
        etapas.map(
            etapa => {

                const projetosEtapa =
                    projetos.filter(
                        projeto =>
                            projeto.etapa === etapa
                    );


                return `

                    <div class="coluna">

                        <div class="coluna-titulo">

                            <span>
                                ${etapa}
                            </span>

                            <span class="quantidade">
                                ${projetosEtapa.length}
                            </span>

                        </div>


                        ${projetosEtapa.map(
                            projeto => {

                                const indice =
                                    etapas.indexOf(
                                        etapa
                                    );


                                return `

                                    <div class="card-projeto">

                                        <h3>
                                            ${projeto.nome}
                                        </h3>

                                        <p>
                                            ${projeto.solicitante}
                                        </p>

                                        <p>
                                            ${badgePrioridade(
                                                projeto.prioridade
                                            )}
                                        </p>

                                        <p>
                                            Prazo:
                                            ${formatarData(
                                                projeto.prazo
                                            )}
                                        </p>


                                        <div class="acoes-card">

                                            ${
                                                indice > 0
                                                ?
                                                `

                                                <button
                                                    class="btn-mini"
                                                    onclick="
                                                        moverProjeto(
                                                            ${projeto.id},
                                                            -1
                                                        )
                                                    "
                                                >
                                                    ←
                                                </button>

                                                `
                                                :
                                                ""
                                            }


                                            <button
                                                class="btn-mini"
                                                onclick="
                                                    verDetalhes(
                                                        ${projeto.id}
                                                    )
                                                "
                                            >
                                                Ver
                                            </button>


                                            ${
                                                indice <
                                                etapas.length - 1
                                                ?
                                                `

                                                <button
                                                    class="
                                                        btn-mini
                                                        btn-avancar
                                                    "
                                                    onclick="
                                                        moverProjeto(
                                                            ${projeto.id},
                                                            1
                                                        )
                                                    "
                                                >
                                                    Avançar →
                                                </button>

                                                `
                                                :
                                                ""
                                            }

                                        </div>

                                    </div>

                                `;

                            }
                        ).join("")}

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   MOVER PROJETO
========================= */

function moverProjeto(
    id,
    direcao
) {

    const projeto =
        projetos.find(
            projeto =>
                projeto.id === id
        );


    if (!projeto) {
        return;
    }


    const indice =
        etapas.indexOf(
            projeto.etapa
        );


    const novoIndice =
        indice + direcao;


    if (
        novoIndice < 0 ||
        novoIndice >= etapas.length
    ) {
        return;
    }


    projeto.etapa =
        etapas[novoIndice];


    salvarProjetos();

    atualizarKanban();


    notificacao(
        "Projeto movido para " +
        projeto.etapa
    );

}


/* =========================
   DETALHES
========================= */

function verDetalhes(id) {

    const projeto =
        projetos.find(
            projeto =>
                projeto.id === id
        );


    if (!projeto) {
        return;
    }


    const progresso =
        progressoEtapas[
            projeto.etapa
        ];


    const detalhes =
        document.getElementById(
            "detalhesProjeto"
        );


    detalhes.innerHTML = `

        <div class="detalhes-grid">

            <div class="painel">

                <h2>
                    ${projeto.nome}
                </h2>

                <br>

                ${badgeStatus(
                    projeto.etapa
                )}

                ${badgePrioridade(
                    projeto.prioridade
                )}


                <br><br>


                <h3>Descrição</h3>

                <p class="descricao">
                    ${projeto.descricao}
                </p>


                <br>


                <p>
                    <strong>
                        Solicitante:
                    </strong>

                    ${projeto.solicitante}
                </p>


                <br>


                <p>
                    <strong>
                        Responsável:
                    </strong>

                    ${projeto.responsavel}
                </p>


                <br>


                <p>
                    <strong>
                        Prazo:
                    </strong>

                    ${formatarData(
                        projeto.prazo
                    )}
                </p>


                <br>


                <p>
                    <strong>
                        Progresso:
                    </strong>

                    ${progresso}%
                </p>


                <div class="progresso-barra">

                    <div
                        style="
                            width:
                            ${progresso}%
                        "
                    ></div>

                </div>

            </div>


            <div class="painel">

                <h2>
                    Fluxo do Projeto
                </h2>

                <br>


                ${etapas.map(
                    (etapa, indice) => {

                        const atual =
                            etapas.indexOf(
                                projeto.etapa
                            );


                        const situacao =
                            atual >= indice
                            ?
                            "Etapa alcançada"
                            :
                            "Pendente";


                        return `

                            <div class="etapa">

                                <strong>
                                    ${indice + 1}.
                                    ${etapa}
                                </strong>

                                <span>
                                    ${situacao}
                                </span>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;


    abrirPagina(
        "detalhes"
    );

}


/* =========================
   INICIAR SISTEMA
========================= */

atualizarDashboard();