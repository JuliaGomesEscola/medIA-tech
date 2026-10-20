from pathlib import Path
import pandas as pd

CAMINHO_CSV = Path(__file__).resolve().parent / "database" / "DOE+.csv"


def ler_dados():
    df = pd.read_csv(CAMINHO_CSV)
    colunas = [
        "id_agendamento",
        "data_cadastro",
        "cpf_paciente",
        "nome_paciente",
        "id_hemocentro",
        "nome_instituição",
        "quantidade_de_bolsas",
        "SUS_paciente",
        "id_estoque",
        "carteirinha_do_convenio_paciente",
    ]
    if not set(colunas).issubset(df.columns):
        raise ValueError("Confira as dez colunas do CSV.")

    df = df[colunas].copy()
    if df.empty or df.isna().any().any():
        raise ValueError("O CSV está vazio ou contém campos ausentes.")

    df["data_cadastro"] = pd.to_datetime(
        df["data_cadastro"], format="%d/%m/%Y %H:%M", errors="raise"
    )

    numeros = [
        "id_agendamento",
        "cpf_paciente",
        "id_hemocentro",
        "quantidade_de_bolsas",
        "SUS_paciente",
        "id_estoque",
        "carteirinha_do_convenio_paciente",
    ]
    for coluna in numeros:
        df[coluna] = pd.to_numeric(df[coluna], errors="raise")

    if df[numeros].isin([float("inf"), -float("inf")]).any().any():
        raise ValueError("O CSV contém valores infinitos.")

    for coluna in [
        "id_agendamento",
        "cpf_paciente",
        "id_hemocentro",
        "quantidade_de_bolsas",
        "SUS_paciente",
    ]:
        if (df[coluna] % 1 != 0).any():
            raise ValueError("IDs e quantidades devem ser inteiros.")

    if (df[["id_agendamento", "cpf_paciente", "id_hemocentro"]] <= 0).any().any():
        raise ValueError("Os identificadores devem ser positivos.")

    if (df[["carteirinha_do_convenio_paciente", "SUS_paciente", "id_estoque"]] < 0).any().any():
        raise ValueError("Quantidade e preço não podem ser negativos.")

    if not df["quantidade_de_bolsas"].between(0, 100).all():
        raise ValueError("A quantidade de bolsas deve estar entre 0 a 100.")

    if df.duplicated().any():
        raise ValueError(
            "Há linhas idênticas. Verifique a fonte antes de analisar."
        )

    for coluna in ["cpf_paciente", "id_hemocentro"]:
        if (df.groupby("id_agendamento")[coluna].nunique() > 1).any():
            raise ValueError("Um agendamento tem datas ou pacientes conflitantes.")

    df["valor_item"] = ( df["quantidade_de_bolsas"] )
    return df
    

def resumo(df):
    totais_compra = df.groupby("id_agendamento")["valor_item"].sum()
    return {
        "linhas_itens": int(len(df)),
        "total_compras": int(df["id_agendamento"].nunique()),
        "total_clientes": int(df["cpf_paciente"].nunique()),
        "total_produtos": int(df["id_hemocentro"].nunique()),
        "total_unidades": int(df["quantidade_de_bolsas"].sum()),
        "valor_total": round(float(df["valor_item"].sum()), 2),
        "media_por_compra": round(float(totais_compra.mean()), 2),
        "mediana_por_compra": float(totais_compra.median().round(2)),
        "data_inicial": df["data_cadastro"].min().strftime("%Y-%m-%d"),
        "data_final": df["data_cadastro"].max().strftime("%Y-%m-%d"),
    }


def por_produto(df):
    tabela = df.groupby(["id_hemocentro", "nome_instituição"], as_index=False).agg(
        unidades=("quantidade_de_bolsas", "sum"),
        valor_total=("valor_item", "sum"),
    )
    tabela["valor_total"] = tabela["valor_total"].round(2)
    tabela = tabela.sort_values("unidades", ascending=False)
    return tabela.to_dict(orient="records")


def por_data(df):
    tabela = df.assign(
        dt_compra=df["data_cadastro"].dt.normalize()
    ).groupby("dt_compra", as_index=False).agg(
        total_compras=("id_agendamento", "nunique"),
        valor_total=("valor_item", "sum"),
    )
    tabela["valor_total"] = tabela["valor_total"].round(2)
    tabela["dt_compra"] = tabela["dt_compra"].dt.strftime("%Y-%m-%d")
    return tabela.to_dict(orient="records")


if __name__ == "__main__":
    try:
        dados = ler_dados()
        print("Primeiros cinco itens:")
        print(dados.head())
        print("\nResumo:")
        print(resumo(dados))
    except Exception as e:
        print(f"Erro ao testar leitura: {e}")
