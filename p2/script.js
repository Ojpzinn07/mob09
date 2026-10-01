let dados = JSON.parse(localStorage.getItem("cadastros")) || [];

let editandoId = null;


// SALVAR
function salvar() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const idade = document.getElementById("idade").value.trim();

    if (nome === "" || email === "" || idade === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (editandoId !== null) {

        const indice = dados.findIndex(item => item.id === editandoId);

        if (indice !== -1) {
            dados[indice].nome = nome;
            dados[indice].email = email;
            dados[indice].idade = idade;
        }

        editandoId = null;

        document.getElementById("btnSalvar").textContent = "Salvar";

    } else {

        const novoCadastro = {
            id: Date.now(),
            nome: nome,
            email: email,
            idade: idade
        };

        dados.push(novoCadastro);
    }

    salvarLocalStorage();
    atualizarTabela();
    limparCampos();
}


// ATUALIZAR TABELA
function atualizarTabela() {

    const lista = document.getElementById("lista");

    lista.innerHTML = "";

    dados.forEach(item => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.idade}</td>

            <td>
                <button class="btn-editar" onclick="editar(${item.id})">
                    ✏️ Editar
                </button>

                <button class="btn-excluir" onclick="excluir(${item.id})">
                    🗑️ Excluir
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });
}


// EDITAR
function editar(id) {

    const cadastro = dados.find(item => item.id === id);

    if (!cadastro) {
        return;
    }

    document.getElementById("nome").value = cadastro.nome;
    document.getElementById("email").value = cadastro.email;
    document.getElementById("idade").value = cadastro.idade;

    editandoId = id;

    document.getElementById("btnSalvar").textContent = "Atualizar";
}


// EXCLUIR
function excluir(id) {

    const confirmar = confirm("Deseja realmente excluir este cadastro?");

    if (!confirmar) {
        return;
    }

    dados = dados.filter(item => item.id !== id);

    salvarLocalStorage();
    atualizarTabela();
}


// LIMPAR CAMPOS
function limparCampos() {

    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("idade").value = "";
}


// LOCAL STORAGE
function salvarLocalStorage() {

    localStorage.setItem("cadastros", JSON.stringify(dados));
}


// EXPORTAR JSON
function exportar() {

    if (dados.length === 0) {
        alert("Não há dados para exportar!");
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
    link.download = "cadastros.json";

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
                alert("O arquivo JSON não possui um formato válido.");
                return;
            }

            dados = dadosImportados;

            salvarLocalStorage();
            atualizarTabela();

            alert("Dados importados com sucesso!");

        } catch (erro) {

            alert("Erro ao importar o arquivo JSON.");
        }
    };

    leitor.readAsText(arquivo);

    event.target.value = "";
}


// RESETAR TUDO
function resetar() {

    const confirmar = confirm(
        "Tem certeza que deseja apagar todos os cadastros?"
    );

    if (!confirmar) {
        return;
    }

    dados = [];

    editandoId = null;

    localStorage.removeItem("cadastros");

    limparCampos();

    document.getElementById("btnSalvar").textContent = "Salvar";

    atualizarTabela();
}


// CARREGAR DADOS AO ABRIR A PÁGINA
atualizarTabela();