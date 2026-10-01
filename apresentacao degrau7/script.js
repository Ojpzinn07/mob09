let dados = [];

let proximoId = 1;


// SALVAR
function salvar() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (nome === "" || email === "") {
        alert("Preencha o nome e o e-mail!");
        return;
    }

    const pessoa = {
        id: proximoId,
        nome: nome,
        email: email
    };

    dados.push(pessoa);

    proximoId++;

    atualizarTabela();

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";

    document.getElementById("nome").focus();
}


// ATUALIZAR TABELA
function atualizarTabela() {

    const lista = document.getElementById("lista");

    lista.innerHTML = "";

    dados.forEach(function(pessoa) {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${pessoa.id}</td>
            <td>${pessoa.nome}</td>
            <td>${pessoa.email}</td>
            <td>
                <button
                    class="btn-excluir"
                    onclick="excluir(${pessoa.id})">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });
}


// EXCLUIR
function excluir(id) {

    dados = dados.filter(function(pessoa) {
        return pessoa.id !== id;
    });

    atualizarTabela();
}


// EXPORTAR JSON
function exportar() {

    if (dados.length === 0) {
        alert("Não existem dados para exportar!");
        return;
    }

    const conteudo = JSON.stringify(dados, null, 2);

    const arquivo = new Blob(
        [conteudo],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(arquivo);

    const link = document.createElement("a");

    link.href = url;

    link.download = "dados.json";

    link.click();

    URL.revokeObjectURL(url);
}


// IMPORTAR JSON
function importar(event) {

    const arquivo = event.target.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function(e) {

        try {

            const dadosImportados = JSON.parse(e.target.result);

            if (!Array.isArray(dadosImportados)) {
                alert("O arquivo JSON não possui um formato válido!");
                return;
            }

            dados = dadosImportados;

            if (dados.length > 0) {

                proximoId =
                    Math.max(
                        ...dados.map(pessoa => Number(pessoa.id))
                    ) + 1;

            } else {

                proximoId = 1;
            }

            atualizarTabela();

            alert("Dados importados com sucesso!");

        } catch (erro) {

            alert("Erro ao ler o arquivo JSON!");

        }
    };

    leitor.readAsText(arquivo);

    event.target.value = "";
}


// RESETAR TUDO
function resetar() {

    if (dados.length === 0) {
        alert("Não existem dados para apagar!");
        return;
    }

    const confirmar = confirm(
        "Tem certeza que deseja apagar todos os dados?"
    );

    if (!confirmar) {
        return;
    }

    dados = [];

    proximoId = 1;

    atualizarTabela();
}