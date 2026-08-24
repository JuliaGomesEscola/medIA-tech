import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from ollama import chat

# 1. LER O CSV
dados = pd.read_csv("dados.csv", sep=";")

# 2. FEATURES E LABEL (Substitua pelos nomes das colunas do seu CSV)
X = dados[[
    "frequencia_doacao",
    "dias_ultima_doacao",
    "idade"
]]
y = dados["elegivel_beneficio"]

# 3. TRANSFORMAR TEXTOS EM NÚMEROS (SE HOUVER COLUNAS DE TEXTO)
X = pd.get_dummies(X)
colunas_modelo = X.columns

# 4. TREINO E TESTE
X_treino, X_teste, y_treino, y_teste = train_test_split(
    X, y, test_size=0.20, random_state=42
)

# 5. DECISION TREE
modelo = DecisionTreeClassifier(
    max_depth=8,
    random_state=42,
    class_weight="balanced"
)
modelo.fit(X_treino, y_treino)

# 6. AVALIAR
previsoes = modelo.predict(X_teste)
acuracia = accuracy_score(y_teste, previsoes)
print(f"Acurácia do modelo: {acuracia:.2%}")

# 7. FUNÇÃO DA LIA (OLLAMA)
def perguntar_ollama(pergunta):
    resposta = chat(
        model="gemma3",
        messages=[
            {
                "role": "system",
                "content": """
                Você é a Lia, uma assistente virtual especialista em doação de sangue e benefícios para doadores.
                Responda em português.
                Use linguagem simples, clara e acolhedora.
                Não invente informações médicas ou regras de benefícios.
                Nunca trate uma previsão como certeza absoluta.
                """
            },
            {
                "role": "user",
                "content": pergunta
            }
        ]
    )
    return resposta.message.content

# 8. MENU INTERATIVO
while True:
    print("\n===============================")
    print(" SISTEMA LIA - SANGUE ")
    print("===============================")
    print("1 - Consultar Benefício/Elegibilidade")
    print("2 - Conversar com a Lia")
    print("0 - Sair")

    opcao = input("Escolha uma opção: ")

    if opcao == "0":
        print("Programa encerrado.")
        break

    elif opcao == "1":
        # Pergunta os dados ao usuário (Ajuste para o seu projeto)
        freq = float(input("Frequência de doações no ano: "))
        dias = float(input("Dias desde a última doação: "))
        idade = float(input("Idade do doador: "))

        novo = pd.DataFrame([{
            "frequencia_doacao": freq,
            "dias_ultima_doacao": dias,
            "idade": idade
        }])

        novo = pd.get_dummies(novo)
        novo = novo.reindex(columns=colunas_modelo, fill_value=0)

        previsao = modelo.predict(novo)[0]
        print(f"\nResultado da Análise: {previsao}")

        # Solicita à Lia para explicar o resultado
        prompt_explicacao = f"""
        O sistema calculou a seguinte previsão de elegibilidade a benefícios para o doador: {previsao}.
        A acurácia geral do modelo é: {acuracia:.2%}.

        Explique este resultado para o doador em linguagem simples e amigável.
        Diga que o resultado foi obtido a partir do histórico de dados de doações.
        Não trate a previsão como certeza absoluta.
        """

        explicacao = perguntar_ollama(prompt_explicacao)
        print("\nLia:")
        print(explicacao)

    elif opcao == "2":
        pergunta = input("Digite sua pergunta para a Lia: ")
        resposta = perguntar_ollama(pergunta)
        print("\nLia:")
        print(resposta)

    else:
        print("Opção inválida.")

