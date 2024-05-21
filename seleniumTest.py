from selenium import webdriver
from selenium.webdriver.common.by import By
from termcolor import colored
from tqdm import tqdm
import itertools
import time

# Inicializando o driver do Chrome
driver = webdriver.Chrome()

# Abrindo a URL
driver.get("https://bealomes.github.io/cadastroWebTesteSelene/")

# Localizando os elementos do formulário
input_name_element = driver.find_element(By.ID, "inputName")
input_name_help_element = driver.find_element(By.ID, "inputNameHelp")

input_year_element = driver.find_element(By.ID, "inputYear")
input_year_help_element = driver.find_element(By.ID, "inputYearHelp")

input_email_element = driver.find_element(By.ID, "inputEmail")
input_email_help_element = driver.find_element(By.ID, "inputEmailHelp")

input_password_element = driver.find_element(By.ID, "inputPassword")
input_password_help_element = driver.find_element(By.ID, "inputPasswordHelp")
input_password_strength_element = driver.find_element(By.ID, "passStrengthMeter")

input_button_element = driver.find_element(By.ID, "submitButton")
input_result_element = driver.find_element(By.ID, "formResult")

# Testes de entrada (nome, resultado esperado do nome)
nameTests = [
    ("Gus", "Nome invalido"),
    ("Gustavo Moura", ""),
    ("", "Nome invalido")
]

# Testes de entrada (ano, resultado esperado do ano)
yearTests = [
    ("1999", ""),
    ("", "Ano invalido")
]

# Testes de entrada (email, resultado esperado do email)
emailTests = [
    ("gustavoscarenci@usp.br", ""),
    ("", "Email invalido")
]

# Testes de entrada (senha, resultado esperado da senha, força esperada da senha)
passwordTests = [
    ("3uAm@Pud1m99", "Senha moderada", "15"),
    ("", "Senha invalida", "0"),
]

tests = {}
testCount = 0
total_iterations = len(nameTests) * len(yearTests) * len(emailTests) * len(passwordTests)

time.sleep(5)

# Abrindo arquivo para escrever os testes
with open("tests.csv", "w") as f:
    f.write("Test,Name,ExpectedNameResult,Year,ExpectedYearResult,Email,ExpectedEmailResult,Password,ExpectedPasswordResult,ExpectedPasswordStrength,ExpectedResult\n")

    # Usando itertools.product para criar um produto cartesiano dos testes
    for (name, x_name_result), (year, x_year_result), (email, x_email_result), (password, x_password_result, x_strength_result) in tqdm(itertools.product(nameTests, yearTests, emailTests, passwordTests), total=total_iterations):
        testCount += 1

        tests[testCount] = {}

        x_result = "Cadastro Invalido"
        if x_name_result == "" and x_year_result == "" and x_email_result == "" and "Senha invalida" not in x_password_result:
            x_result = "Cadastro Valido"

        # Escrevendo o teste no arquivo
        f.write(f"{testCount},{name},{x_name_result},{year},{x_year_result},{email},{x_email_result},{password},{x_password_result},{x_strength_result},{x_result}\n")

        input_name_element.clear()
        input_name_element.send_keys(name)

        input_year_element.clear()
        input_year_element.send_keys(year)

        input_email_element.clear()
        input_email_element.send_keys(email)

        input_password_element.clear()
        input_password_element.send_keys(password)

        input_button_element.click()
        
        # Espera por um curto período para garantir que todas as mensagens de validação sejam atualizadas
        time.sleep(1)

        # Verificando os resultados dos testes
        tests[testCount]["name"] = (input_name_help_element.text, x_name_result, (input_name_help_element.text == x_name_result))
        tests[testCount]["year"] = (input_year_help_element.text, x_year_result, (input_year_help_element.text == x_year_result))
        tests[testCount]["email"] = (input_email_help_element.text, x_email_result, (input_email_help_element.text == x_email_result))
        tests[testCount]["password"] = (input_password_help_element.text, x_password_result, (x_password_result in input_password_help_element.text))
        tests[testCount]["strength"] = (input_password_strength_element.get_attribute("value"), x_strength_result, (input_password_strength_element.get_attribute("value") == x_strength_result))
        tests[testCount]["submit"] = (input_result_element.text, x_result, (input_result_element.text == x_result))

        if all(value[2] for value in tests[testCount].values()):
            tests[testCount]["result"] = True
        else:
            tests[testCount]["result"] = False

# Contando testes bem-sucedidos
successful_tests = sum(1 for value in tests.values() if value["result"])

print(colored(f"Total of {successful_tests} / {testCount}", "blue"))
for key, value in tests.items():
    if value["result"]:
        print(colored(f"Test {key}: Successful", "green"))
    else:
        print(colored(f"Test {key}: Failed on: ", "red"))
        for k, v in value.items():
            if k != "result" and not v[2]:
                print(colored(f"\t{k}: got \"{v[0]}\" (expected \"{v[1]}\")", "red"))

# Fechando o navegador
driver.quit()
