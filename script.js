document.addEventListener("DOMContentLoaded", function() {

    // =====================================
    // FUNÇÕES AUXILIARES
    // =====================================

    function buscarDados(nome) {
        return JSON.parse(localStorage.getItem(nome)) || [];
    }

    function salvarDados(nome, dados) {
        localStorage.setItem(nome, JSON.stringify(dados));
    }

    // Procura uma seção na página pelo texto do <h2>
    function acharSecao(tituloTexto, classePai) {
        let titulos = document.querySelectorAll("h2");
        for (let i = 0; i < titulos.length; i++) {
            if (titulos[i].textContent.trim() == tituloTexto) {
                return titulos[i].closest(classePai);
            }
        }
        return null;
    }

    // =====================================
    // LOGIN E USUÁRIO
    // =====================================

    let botaoLogin = document.querySelector(".btn-login");
    if (botaoLogin) {
        botaoLogin.addEventListener("click", function(evento) {
            let campos = document.querySelectorAll(".login-box input");
            let usuario = campos[0].value;
            let senha = campos[1].value;

            if (usuario == "" || senha == "") {
                evento.preventDefault();
                alert("Preencha todos os campos!");
            } else {
                localStorage.setItem("newtechUsuario", usuario);
            }
        });
    }

    // Mostrar nome do usuário
    let nomeUsuario = localStorage.getItem("newtechUsuario");
    let infoUsuario = document.querySelector(".user-info");
    if (nomeUsuario && infoUsuario) {
        infoUsuario.textContent = "Olá, " + nomeUsuario;
    }

    // Mostrar e esconder senha
    let olho = document.querySelector(".password-toggle");
    if (olho) {
        olho.addEventListener("click", function() {
            let campoSenha = document.querySelectorAll(".login-box input")[1];
            if (campoSenha.type == "password") {
                campoSenha.type = "text";
            } else {
                campoSenha.type = "password";
            }
        });
    }

    // Esqueci minha senha
    let esqueci = document.querySelector(".forgot");
    if (esqueci) {
        esqueci.addEventListener("click", function(evento) {
            evento.preventDefault();
            alert("Entre em contato com o administrador para recuperar sua senha.");
        });
    }

    // =====================================
    // CADASTRAR EQUIPAMENTOS
    // =====================================

    let caixaCadastro = acharSecao("Cadastrar Equipamento", ".form-box");
    if (caixaCadastro) {
        let botao = caixaCadastro.querySelector("a.btn");

        botao.addEventListener("click", function(evento) {
            evento.preventDefault();

            let campos = caixaCadastro.querySelectorAll('input[type="text"]');
            let selecoes = caixaCadastro.querySelectorAll("select");
            let descricao = caixaCadastro.querySelector("textarea");

            let nome = campos[0].value;
            let patrimonio = campos[1].value;
            let local = selecoes[0].value;
            let categoria = selecoes[1].value;

            if (nome == "" || patrimonio == "" || local.includes("Selecione") || categoria.includes("Selecione")) {
                alert("Preencha todos os campos!");
                return;
            }

            let equipamentos = buscarDados("newtechEquipamentos");

            for (let i = 0; i < equipamentos.length; i++) {
                if (equipamentos[i].patrimonio == patrimonio) {
                    alert("Esse patrimônio já está cadastrado!");
                    return;
                }
            }

            equipamentos.push({
                nome: nome,
                patrimonio: patrimonio,
                local: local,
                categoria: categoria,
                descricao: descricao ? descricao.value : "",
                status: "Operacional"
            });

            salvarDados("newtechEquipamentos", equipamentos);
            alert("Equipamento cadastrado com sucesso!");
            window.location.href = "equipamentos.html";
        });
    }

    // =====================================
    // LISTA DE EQUIPAMENTOS
    // =====================================

    let tabela = document.querySelector(".container table");
    let pesquisaEquipamento = document.querySelector(".input-busca");

    if (tabela && pesquisaEquipamento) {
        let equipamentos = buscarDados("newtechEquipamentos");

        for (let i = 0; i < equipamentos.length; i++) {
            let linha = tabela.insertRow();
            linha.insertCell().textContent = equipamentos[i].patrimonio;
            linha.insertCell().textContent = equipamentos[i].nome;
            linha.insertCell().textContent = equipamentos[i].local;
            linha.insertCell().textContent = equipamentos[i].status;
        }

        pesquisaEquipamento.addEventListener("input", function() {
            let texto = pesquisaEquipamento.value.toLowerCase();
            let linhas = tabela.querySelectorAll("tr");

            for (let i = 1; i < linhas.length; i++) {
                let conteudo = linhas[i].textContent.toLowerCase();
                linhas[i].style.display = conteudo.includes(texto) ? "" : "none";
            }
        });
    }

    // =====================================
    // PÁGINA DE BUSCA
    // =====================================

    let caixaBusca = document.querySelector(".container-center .form-box");
    if (caixaBusca) {
        let campoBusca = caixaBusca.querySelector("input");
        let botaoBusca = caixaBusca.querySelector("a.btn");

        function pesquisar() {
            let texto = campoBusca.value.toLowerCase();
            if (texto == "") {
                alert("Digite algo para pesquisar!");
                return;
            }

            // Junta itens fixos + equipamentos cadastrados
            let listaCompleta = [
                "Impressora 3D", "Torno CNC 02", "Computador LAB 01", "Computador LAB 02",
                "Furadeira de Bancada 01", "Compressor de Ar 01", "Torno Mecânico 01", "Máquina de Solda",
                "OS-00048 Impressora 3D", "OS-00047 Torno CNC 02", "OS-00046 Computador LAB 01",
                "OS-00045 Computador LAB 02", "OS-00044 Furadeira de Bancada 01",
                "OS-00043 Compressor de Ar 01", "OS-00042 Torno Mecânico 01"
            ];

            let cadastrados = buscarDados("newtechEquipamentos");
            for (let i = 0; i < cadastrados.length; i++) {
                listaCompleta.push(cadastrados[i].nome);
            }

            // Cria ou limpa a área de resultados
            let area = document.querySelector(".resultados-busca");
            if (!area) {
                area = document.createElement("div");
                area.className = "resultados-busca";
                caixaBusca.parentNode.appendChild(area);
            }

            area.innerHTML = "<h3>Resultados da busca</h3>";
            let achouAlgo = false;

            for (let i = 0; i < listaCompleta.length; i++) {
                if (listaCompleta[i].toLowerCase().includes(texto)) {
                    let item = document.createElement("p");
                    item.textContent = listaCompleta[i];
                    area.appendChild(item);
                    achouAlgo = true;
                }
            }

            if (!achouAlgo) {
                area.innerHTML += "<p>Nenhum resultado encontrado.</p>";
            }
        }

        if (botaoBusca) {
            botaoBusca.addEventListener("click", function(evento) {
                evento.preventDefault();
                pesquisar();
            });
        }

        campoBusca.addEventListener("keydown", function(evento) {
            if (evento.key == "Enter") {
                evento.preventDefault();
                pesquisar();
            }
        });
    }

    // =====================================
    // AGENDAR MANUTENÇÃO
    // =====================================

    let caixaAgendamento = acharSecao("Agendar Manutenção", ".form-box");
    if (caixaAgendamento) {
        let data = caixaAgendamento.querySelector('input[type="date"]');
        let botao = caixaAgendamento.querySelector(".btn-full");

        if (data) {
            data.min = new Date().toISOString().split("T")[0];
        }

        botao.addEventListener("click", function(evento) {
            evento.preventDefault();

            let selecoes = caixaAgendamento.querySelectorAll("select");
            let horario = caixaAgendamento.querySelector('input[type="time"]');
            let duracao = caixaAgendamento.querySelector('input[type="text"]');

            let tecnico = selecoes[0].value;
            let equipamento = selecoes[1].value;

            if (tecnico.includes("Selecione") || equipamento.includes("Selecione") ||
                data.value == "" || horario.value == "" || duracao.value == "") {
                alert("Preencha todos os campos!");
                return;
            }

            let agendamentos = buscarDados("newtechAgendamentos");
            agendamentos.push({
                tecnico: tecnico,
                equipamento: equipamento,
                data: data.value,
                horario: horario.value,
                duracao: duracao.value
            });
            salvarDados("newtechAgendamentos", agendamentos);

            let notificacoes = buscarDados("newtechNotificacoes");
            let dataInvertida = data.value.split("-").reverse().join("/");
            notificacoes.push("Manutenção agendada para " + equipamento + " em " + dataInvertida + " às " + horario.value + ".");
            salvarDados("newtechNotificacoes", notificacoes);

            alert("Agendamento realizado com sucesso!");
            window.location.href = "notificacoes.html";
        });
    }

    // =====================================
    // NOTIFICAÇÕES
    // =====================================

    let containerNotificacoes = acharSecao("Notificações", ".container");
    if (containerNotificacoes) {
        let notificacoes = buscarDados("newtechNotificacoes");

        for (let i = 0; i < notificacoes.length; i++) {
            let aviso = document.createElement("div");
            let texto = document.createElement("p");

            texto.textContent = notificacoes[i];
            aviso.appendChild(texto);

            aviso.style.backgroundColor = "white";
            aviso.style.padding = "15px";
            aviso.style.marginTop = "10px";
            aviso.style.borderRadius = "8px";

            containerNotificacoes.appendChild(aviso);
        }
    }

    // =====================================
    // PAINEL GERAL
    // =====================================

    let painel = acharSecao("Painel Geral", ".container");
    if (painel) {
        let cards = document.querySelectorAll(".grid-cards .card h3");
        let equipamentos = buscarDados("newtechEquipamentos");

        if (cards.length > 0) {
            cards[0].textContent = Number(cards[0].textContent) + equipamentos.length;
        }
    }

});