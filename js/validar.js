
//Beatriz Lomes - 12548038

//criando os objetos dos elementos de texto do form

var nome = document.querySelector("#inputName");
var nomeHelp = document.querySelector("#inputNameHelp");
var ano = document.querySelector("#inputYear");
var anoHelp = document.querySelector("#inputYearHelp");
var email = document.querySelector("#inputEmail");
var emailHelp = document.querySelector("#inputEmailHelp");
var senha = document.querySelector("#inputPassword");
var senhaHelp = document.querySelector("#inputPasswordHelp");
var senhaResult = document.querySelector("#inputResult");
var passStrengthMeter =  document.querySelector('#passStrengthMeter');
var showPassword =  document.querySelector('#showPassword');
var form = document.querySelector('#singleForm');
var formResult = document.querySelector('#formResult');



/*declarando o evento listener para o campos de texto do form. 
Uma vez o foco do campo inputName mude, será chamada a função validarNome*/
// Event listeners para validação
nome.addEventListener('focusout', validarNome);
ano.addEventListener('focusout', validarAno);
email.addEventListener('focusout', validarEmail);
senha.addEventListener('focusout', validarSenha);



/*declaração tradicional de função validarNome(e)
'e' é o objeto do tipo evento que contém, alpem de outras propriedades, o objeto que iniciou o evento,
neste caso o objeto 'nome'
*/

function validarNome(e) {
    // Declaração da expressão regular para definir o formato de um nome válido (completo ou apenas um nome)
    const regexNomeCompleto = /^[A-Z][a-z] [A-Z][a-z]$/;
    const regexNome = /^[A-Z][a-z]$/;

    console.log(e); // Impressão em console do objeto evento 'e'
    console.log(e.target.value); // Impressão em console do valor do objeto 'nome' que originou o evento   

    var noSpacesName = nome.value.replace(/\s/g, '');

    if (!e.target.value.trim().match(regexNomeCompleto) && !e.target.value.trim().match(regexNome) && (noSpacesName.length < 6 )) {
        // Muda o conteúdo e o estilo do objeto nomeHelp que referencia o elemento html com id=inputNameHelp
        nomeHelp.textContent = "Nome invalido"; 
        nomeHelp.style.color = "red";
        return 0;
    } else {
        nomeHelp.textContent = "";
        return 1;
    }       
}

//Função para validar se o ano informado está válido, que é se esta no intervalo de 1904 a 2024
function validarAno() {
    const regexAno = /^(19\d\d|20[01]\d|2024)$/;
    if (!ano.value.trim().match(regexAno)) {
        anoHelp.textContent = "Ano invalido";
        anoHelp.style.color = "red";
        return 0;
    } else {
        anoHelp.textContent = "";
        return 1;
    }
}

//Função para validar se o e-mail esta na estrutura convercionald e e-mail, que é  conter letras e números seguido do @ seguido de caracteres e/ou números seguido de . e finalizando em br, com, net, org
function validarEmail() {
    const regexEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.(br|com|net|org)$/;
    if (!email.value.trim().match(regexEmail)) {
        emailHelp.textContent = "Email invalido";
        emailHelp.style.color = "red";
        return 0;
    } else {
        emailHelp.textContent = "";
        return 1;
    }
}

function avaliarForcaSenha(senha) {
    const possuiCaractereEspecial = (senha.match(/[!@#%&]/g) || []).length;
    const possuiNumero = (senha.match(/[0-9]/g) || []).length;
    const possuiLetraMaiuscula = (senha.match(/[A-Z]/g) || []).length;
    const comprimento = senha.length;

    if (comprimento > 12 && possuiCaractereEspecial > 1 && possuiNumero > 1 && possuiLetraMaiuscula > 1) {
        return "Senha forte";
    } else if (comprimento > 8 && possuiCaractereEspecial && possuiNumero && possuiLetraMaiuscula) {
        return "Senha moderada";
    } else if (comprimento >= 6) {
        return "Senha fraca";
    }
    return "Senha inválida";
}

//Função para validar se a senha fonecida é válida
function validarSenha() {
    const regexSenha = /^(?=.*[0-9])(?=.*[!@#%&])(?=.*[a-zA-Z]).{6,20}$/;
    const regexNomeAno = new RegExp(nome.value.trim() + "|" + ano.value.trim(), "i");

    if (!senha.value.match(regexSenha) || senha.value.match(regexNomeAno)) {
        senhaHelp.textContent = "Senha invalida";
        senhaHelp.style.color = "red";
        senhaResult.textContent = "";
        passStrengthMeter.value = 0;
        passStrengthMeter.className = 'invalid';
        return 0;
    } else {
        senhaHelp.textContent = "";
        const forcaSenha = avaliarForcaSenha(senha.value);
        senhaResult.textContent = forcaSenha;

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
                passStrengthMeter.className = 'invalid';
        }
        return 1;
    }
}

/*declarando o evento listener para o campos de texto do form. 
Uma vez o foco seja mudado, será chamada a função validarNome*/

//declaração de função de forma anônima usando uma expressão de função de seta =>

ano.addEventListener('focusout', () => {
    //declaração da expressão regular para definir o formato de um ano válido
    const regexAno = /^[0-9]{4}$/;
    //tirar (trim) espaços em branco antes e depois da string
    const anoTrimado = ano.value.trim();
    console.log(ano.value);

    if(anoTrimado.match(regexAno)==null){
        //muda o conteúdo e o estilo do objeto nomeHelp que referencia o elemento html com id=inputYearHelp
        anoHelp.textContent = "Ano invalido";
        anoHelp.style.color="red";
    }
    else{
        //objeto Date
        var date = new Date();
        //obtem o ano atual
        console.log(date.getFullYear()); 
        
        if( parseInt(anoTrimado) > parseInt(date.getFullYear()) ){
             //muda o conteúdo e o estilo do objeto nomeHelp que referencia o elemento html com id=inputYearHelp
            anoHelp.textContent = "Ano invalido";
            anoHelp.style.color="red";
        }
        else if( parseInt(anoTrimado) < parseInt(date.getFullYear())-120 ){
             //muda o conteúdo e o estilo do objeto nomeHelp que referencia o elemento html com id=inputYearHelp
            anoHelp.textContent = "Ano invalido";
            anoHelp.style.color="red";
        }
        else{
            anoHelp.textContent="";
        }        
        
    }
}
);


// Evento para mostrar ou esconder a senha
showPassword.addEventListener('change', function() {
    senha.type = this.checked ? 'text' : 'password';
});

// Função para validar o formulário ao clicar no botão Enviar
form.addEventListener('submit', function() {
    const nomeValido = validarNome({ target: nome });
    const anoValido = validarAno();
    const emailValido = validarEmail();
    const senhaValida = validarSenha();

   
    if (nomeValido && anoValido && emailValido && senhaValida) {
        formResult.textContent = "Cadastro Valido";
        formResult.style.color = "green";
    } else {
        formResult.textContent = "Cadastro Invalido";
        formResult.style.color = "red";
    }
});

