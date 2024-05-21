// Selecionando os elementos do formulário
var nome = document.querySelector("#inputName");
var nomeHelp = document.querySelector("#inputNameHelp");
var ano = document.querySelector("#inputYear");
var anoHelp = document.querySelector("#inputYearHelp");
var email = document.querySelector("#inputEmail");
var emailHelp = document.querySelector("#inputEmailHelp");
var senha = document.querySelector("#inputPassword");
var senhaHelp = document.querySelector("#inputPasswordHelp");
var passStrengthMeter = document.querySelector('#passStrengthMeter');
var showPassword = document.querySelector('#showPassword');
var form = document.querySelector('#singleForm');
var inputResult = document.querySelector('#inputResult');

// Adicionando event listeners para os campos do formulário
nome.addEventListener('focusout', validarNome);
ano.addEventListener('focusout', validarAno);
email.addEventListener('focusout', validarEmail);
senha.addEventListener('focusout', validarSenha);


// Função para validar nome
function validarNome(e) {
    const regexNomeCompleto = /^[A-Z][a-z]+\s[A-Z][a-z]+$/;
    const regexNome = /^[A-Z][a-z]+$/;

    var noSpacesName = nome.value.replace(/\s/g, '');
    console.log(noSpacesName.length);

    if ((e.target.value.trim().match(regexNomeCompleto) || e.target.value.trim().match(regexNome)) && noSpacesName.length >= 6) {
        nomeHelp.textContent = "";
        return 1;
    } else {
        nomeHelp.textContent = "Nome invalido";
        nomeHelp.style.color = "red";
        return 0;
    }
}

// Função para validar o ano de nascimento
function validarAno() {
    const regexAno = /^(19\d{2}|20[01]\d|202[0-4])$/;
    const anoValor = parseInt(ano.value.trim(), 10);

    if (regexAno.test(ano.value.trim()) && anoValor >= 1904 && anoValor <= 2024) {
        anoHelp.textContent = "";
        return 1;
    } else {
        anoHelp.textContent = "Ano invalido";
        anoHelp.style.color = "red";
        return 0;
    }
}


// Função para validar o e-mail
function validarEmail() {
    //const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(br|com|net|org)$/;
    const regexEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.(br|com|net|org)$/;
    if (!email.value.trim().match(regexEmail)) {
        emailHelp.textContent = "Email invalido";
        emailHelp.style.color = "red";
        return 0;
    } else {
        emailHelp.textContent = "";
        return 1;
    }
}

// Função para avaliar a força da senha
function avaliarForcaSenha(senha) {
    const possuiCaractereEspecial = (senha.match(/[!@#%&]/g) || []).length > 0;
    const possuiNumero = (senha.match(/[0-9]/g) || []).length > 0;
    const possuiLetraMaiuscula = (senha.match(/[A-Z]/g) || []).length > 0;
    const comprimento = senha.length;

    if (comprimento > 12 && possuiCaractereEspecial && possuiNumero && possuiLetraMaiuscula) {
        return "Senha forte";
    } else if (comprimento > 8 && possuiCaractereEspecial && possuiNumero && possuiLetraMaiuscula) {
        return "Senha moderada";
    } else if (comprimento >= 6) {
        return "Senha fraca";
    }
    return "Senha invalida";
}

// Função para validar a senha
function validarSenha() {
    const regexSenha = /^(?=.*[0-9])(?=.*[!@#%&])(?=.*[a-zA-Z]).{6,20}$/;
    const nomeTrimado = nome.value.trim();
    const anoTrimado = ano.value.trim();
    
    let regexNomeAno = null;

    if (nomeTrimado) {
        const nomePartes = nomeTrimado.split(' ');
        if (nomePartes.length > 1) {
            regexNomeAno = new RegExp(nomePartes[0] + "|" + nomePartes[1], "i");
        } else {
            regexNomeAno = new RegExp(nomePartes[0], "i");
        }
    }

    if (!senha.value.trim().match(regexSenha) ||
        (regexNomeAno && senha.value.trim().match(regexNomeAno)) ||
        (anoTrimado && senha.value.trim().includes(anoTrimado))) {
        senhaHelp.textContent = "Senha invalida";
        senhaHelp.style.color = "red";
        passStrengthMeter.value = 0;
        return 0;
    } else {
        senhaHelp.textContent = "";
        const forcaSenha = avaliarForcaSenha(senha.value);
        senhaHelp.textContent = forcaSenha;

        switch (forcaSenha) {
            case "Senha forte":
                passStrengthMeter.value = 30;
                break;
            case "Senha moderada":
                passStrengthMeter.value = 15;
                break;
            case "Senha fraca":
                passStrengthMeter.value = 5;
                break;
            default:
                passStrengthMeter.value = 0;
        }
        return 1;
    }
}

// Evento para mostrar ou esconder a senha
showPassword.addEventListener('change', function() {
    senha.type = this.checked ? 'text' : 'password';
});

// Função para validar o formulário ao clicar no botão Enviar
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const nomeValido = validarNome({ target: nome });
    const anoValido = validarAno();
    const emailValido = validarEmail();
    const senhaValida = validarSenha();

    if (nomeValido && anoValido && emailValido && senhaValida) {
        inputResult.textContent = "Cadastro Valido";
        inputResult.style.color = "green";
    } else {
        inputResult.textContent = "Cadastro Invalido";
        inputResult.style.color = "red";
    }
});
