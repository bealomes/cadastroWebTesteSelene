from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from termcolor import colored
from tqdm import tqdm
import itertools
import time

# Initialize the WebDriver
driver = webdriver.Chrome()
driver.get("https://bealomes.github.io/cadastroWebTesteSelene/")

# Locate elements
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

# Test cases
nameTests = [("Gus", "Nome invalido"), ("Gustavo Moura", ""), ("", "Nome invalido")]
yearTests = [("1999", ""), ("", "Ano invalido")]
emailTests = [("gustavoscarenci@usp.br", ""), ("", "Email invalido")]
passwordTests = [("3uAm@Pud1m99", "Senha moderada", "15"), ("", "Senha invalida", "0")]

# Initialize results storage
tests = {}
testCount = 0
total_iterations = len(nameTests) * len(yearTests) * len(emailTests) * len(passwordTests)

# Wait for the page to fully load
time.sleep(5)

# Open a file to save the test results
with open("tests.csv", "w") as f:
    f.write("Test,Name,ExpectedNameResult,Year,ExpectedYearResult,Email,ExpectedEmailResult,Password,ExpectedPasswordResult,ExpectedPasswordStrength,ExpectedResult\n")
    
    # Iterate over all combinations of test cases
    for (name, x_name_result), (year, x_year_result), (email, x_email_result), (password, x_password_result, x_strength_result) in tqdm(itertools.product(nameTests, yearTests, emailTests, passwordTests), total=total_iterations):
        testCount += 1
        tests[testCount] = {}
        
        # Determine expected form result
        x_result = "Cadastro Invalido"
        if x_name_result == "" and x_year_result == "" and x_email_result == "" and "Senha invalida" not in x_password_result:
            x_result = "Cadastro Valido"
        
        # Write the test case to the file
        f.write(f"{testCount},{name},{x_name_result},{year},{x_year_result},{email},{x_email_result},{password},{x_password_result},{x_strength_result},{x_result}\n")
        
        # Clear and fill the form fields
        input_name_element.clear()
        input_name_element.send_keys(name)
        input_year_element.clear()
        input_year_element.send_keys(year)
        input_email_element.clear()
        input_email_element.send_keys(email)
        input_password_element.clear()
        input_password_element.send_keys(password)
        
        # Submit the form
        input_button_element.click()
        
        # Wait for the result to be displayed
        WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.ID, "formResult"), "Cadastro"))
        
        # Get the results from the form
        tests[testCount]["name"] = (input_name_help_element.text, x_name_result, (input_name_help_element.text == x_name_result))
        tests[testCount]["year"] = (input_year_help_element.text, x_year_result, (input_year_help_element.text == x_year_result))
        tests[testCount]["email"] = (input_email_help_element.text, x_email_result, (input_email_help_element.text == x_email_result))
        tests[testCount]["password"] = (input_password_help_element.text, x_password_result, (input_password_help_element.text == x_password_result))
        tests[testCount]["strength"] = (input_password_strength_element.get_attribute("value"), x_strength_result, (input_password_strength_element.get_attribute("value") == x_strength_result))
        tests[testCount]["result"] = (input_result_element.text, x_result, (input_result_element.text == x_result))

# Print the results
print("Total of", testCount, "/", total_iterations)
for test, result in tests.items():
    print("Test", test, ": ", "Successful" if all(res[2] for res in result.values()) else "Failed on:")
    if not all(res[2] for res in result.values()):
        for key, res in result.items():
            if not res[2]:
                print("    ", key + ": got", colored(res[0], 'red'), "(expected", colored(res[1], 'green') + ")")

# Close the driver
driver.quit()
