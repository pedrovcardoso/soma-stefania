import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Massa de dados baseada no seu JSON
const RAW_DATA = [
    {
        "id": "1500.01.0237225/2023-69",
        "sei_number": "1500.01.0237225/2023-69",
        "description": "TCE - Solicita informações despesas de Saúde e Acordos AMM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0237223/2023-26",
        "sei_number": "1500.01.0237223/2023-26",
        "description": "TCE - Termos celebrados em razão do transbordamento do Dique Lisa da Mina Pau Branco e Informações sobre o crédito, a ser compensado em 2023, advindo das perdas arrecadatórias de ICMS",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1080.01.0073157/2023-94",
        "sei_number": "1080.01.0073157/2023-94",
        "description": "a",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0250326/2023-04",
        "sei_number": "1500.01.0250326/2023-04",
        "description": "TCE - SEDESE - Termo de Acordo do Piso Mineiro de Assistência Social Fixo",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "2070.01.0003808/2022-05",
        "sei_number": "2070.01.0003808/2022-05",
        "description": "FAPEMIG - TCE - Relatório Preliminar de Acompanhamento CAUDE TCE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2022
    },
    {
        "id": "1190.01.0011445/2023-49",
        "sei_number": "1190.01.0011445/2023-49",
        "description": "TCE - FAPEMIG - Relatório Preliminar de Acompanhamento",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0011542/2023-49",
        "sei_number": "1190.01.0011542/2023-49",
        "description": "FAPEMIG - TCE - Relatório Temático nº 06/2023 - 1º Quadrimestre de 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0014256/2023-06",
        "sei_number": "1190.01.0014256/2023-06",
        "description": "TCE - Processo nº 1144745 - Intimação - Prestação de Contas de Exercício 2022 - Solicita informações acerca de despesas com encargos financeiros",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0205656/2023-93",
        "sei_number": "1500.01.0205656/2023-93",
        "description": "TCE - Precatórios no caso de compensações - Criação de Grupo de Trabalho",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0015017/2023-23",
        "sei_number": "1190.01.0015017/2023-23",
        "description": "TCE - Solicita informações sobre os procedimentos para recebimento de assistência financeira da União para o cumprimento do piso salarial da enfermagem",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0015018/2023-93",
        "sei_number": "1190.01.0015018/2023-93",
        "description": "TCE - Solicita o envio, por mês, até agosto, do valor efetivamente transferido para a FAPEMIG custear as suas despesas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0311700/2023-54",
        "sei_number": "1500.01.0311700/2023-54",
        "description": "TCE - Solicita a comprovação da adoção das medidas para o aprimoramento da transparência relacionada aos repasses que são realizados ao Fundeb",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Inspeção Ordinária",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0311695/2023-92",
        "sei_number": "1500.01.0311695/2023-92",
        "description": "TCE - Solicita a comprovação da adoção das medidas para o aprimoramento da transparência relacionada aos repasses que são realizados ao Fundeb",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Inspeção Ordinária",
        "ref_year": 2023
    },
    {
        "id": "1630.01.0002711/2022-51",
        "sei_number": "1630.01.0002711/2022-51",
        "description": "TCE - Processo nº 1.119.845 - Denúncia formulada pela Associação dos Praças Policiais e Bombeiros Militares do Estado de Minas Gerais Aspra/PM-BM - Alíquota contribuição. SECGERAL - TCE - Processo n° 1.167.174 - Representação - Alíquotas da contribuição patronal dos militares - Sistema de Proteção Social dos Militares Estaduais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2022
    },
    {
        "id": "1500.01.0370408/2023-15",
        "sei_number": "1500.01.0370408/2023-15",
        "description": "TCE - FAPEMIG - Processo nº 1127857 - Relatório preliminar de acompanhamento - Repasse da cota financeira da entidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0372946/2023-68",
        "sei_number": "1500.01.0372946/2023-68",
        "description": "TCE - Criação de Grupo de Trabalho - Índices de Ações e Serviços Públicos de Saúde (ASPS) e Manutenção e Desenvolvimento do Ensino (MDE) - Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0372950/2023-57",
        "sei_number": "1500.01.0372950/2023-57",
        "description": "TCE - Demonstrativos consolidados - Orçamento de Investimento das Empresas Controladas pelo Estado",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0378684/2023-51",
        "sei_number": "1500.01.0378684/2023-51",
        "description": "TCE - Relatórios Temáticos - R1 a R19 Mecanismos de Ajuste Fiscal (1º, 2° e 3º bimestre) / Função Educação / Economia / Receita Corrente Líquida / Fapemig / Pessoal e Previdência /Publicidade / Planejamento / Segurança / Créditos Adicionais / Emendas Parlamentares / Execução da LOA / Precatórios / Dívida Ativa / Renúncia de Receita / Balanço Orçamentário / Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0378678/2023-19",
        "sei_number": "1500.01.0378678/2023-19",
        "description": "TCE - Relatórios Temáticos - R19 a R24 Restos a Pagar (retificado) / Mineração / Receita e Despesa / Serviço da Dívida / Recursos Vinculados por Determinação Constitucional ou Legal / Educação /ASPS - Ações e Serviços Públicos de Saúde e Termo de Acordo",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017018/2023-25",
        "sei_number": "1190.01.0017018/2023-25",
        "description": "TCE - Relatório Temático - R 19 - Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017045/2023-72",
        "sei_number": "1190.01.0017045/2023-72",
        "description": "TCE - Relatório Temático - R 24 - ASPS Ações e Serviços Públicos de Saúde e Termo de Acordo Saúde",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017035/2023-51",
        "sei_number": "1190.01.0017035/2023-51",
        "description": "TCE - Relatórios Temáticos - R 20 - Mineração",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017036/2023-24",
        "sei_number": "1190.01.0017036/2023-24",
        "description": "TCE - Relatórios Temáticos - R 21 - Receita e Despesa",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017040/2023-13",
        "sei_number": "1190.01.0017040/2023-13",
        "description": "TCE - Relatórios Temáticos - R 22 - Serviço da Dívida",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017044/2023-02",
        "sei_number": "1190.01.0017044/2023-02",
        "description": "TCE - Relatórios Temáticos - R 23 - Recursos Vinculados por Determinação Constitucional ou Legal - Educação",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017470/2023-43",
        "sei_number": "1190.01.0017470/2023-43",
        "description": "TCE - FAPEMIG - Relatório Temático - R 06 - Amparo e Fomento à Pesquisa - Reitera pedido de manifestação",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0017465/2023-81",
        "sei_number": "1190.01.0017465/2023-81",
        "description": "TCE - Dívida por contratos e Regime de Recuperação Fiscal",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0386460/2023-07",
        "sei_number": "1500.01.0386460/2023-07",
        "description": "TCE - Dívida por contratos e Regime de Recuperação Fiscal (repetido)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0386466/2023-39",
        "sei_number": "1500.01.0386466/2023-39",
        "description": "TCE - FAPEMIG - Relatório Temático - R 06 - Amparo e Fomento à Pesquisa - Reitera pedido de manifestação (repetido)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0393827/2023-45",
        "sei_number": "1500.01.0393827/2023-45",
        "description": "TCE - Informações quanto aos recursos da Educação - Cota Estadual do Salário-Educação - Qese",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1080.01.0037910/2023-96",
        "sei_number": "1080.01.0037910/2023-96",
        "description": "AGE - Processo TCE n° 1144601- Abertura de vistas - Balanço Geral do Estado contas de 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0403068/2023-22",
        "sei_number": "1500.01.0403068/2023-22",
        "description": "TCE Representação nº 1119745 Potenciais condutas irregulares e antieconômicas, apontadas pelo MPMG, identificadas no curso do desenvolvimento das políticas de desestatização da CODEMIG e da CODEMGE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2023
    },
    {
        "id": "1080.01.0007687/2023-56",
        "sei_number": "1080.01.0007687/2023-56",
        "description": "AGE - TCE - Processo nº 1101512 - Balanço Geral 2020 - Parecer Prévio - Levantamento de créditos inscritos em Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0416800/2023-89",
        "sei_number": "1500.01.0416800/2023-89",
        "description": "TCE - Contas Governamentais 2020 - Mínimo constitucional MDE - Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1520.01.0006015/2023-83",
        "sei_number": "1520.01.0006015/2023-83",
        "description": "CGE - TCE - Determinações e recomendações constantes dos Pareceres Prévios relativos às contas anuais de 2020 e de 2019",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020320/2023-14",
        "sei_number": "1190.01.0020320/2023-14",
        "description": "TCE - Relatório Temático nº 26/2023 - Função Educação - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020352/2023-23",
        "sei_number": "1190.01.0020352/2023-23",
        "description": "TCE - Relatório Temático nº 28/2023 - Despesa com Pessoal e a Previdência Social do Servidor Público - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020363/2023-17",
        "sei_number": "1190.01.0020363/2023-17",
        "description": "TCE - Relatório Temático nº 32/2023 - Receita Corrente Líquida - 4º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0011540/2023-06",
        "sei_number": "1190.01.0011540/2023-06",
        "description": "TCE - Relatório Temático nº 3/2023 - Função Educação - 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020370/2023-22",
        "sei_number": "1190.01.0020370/2023-22",
        "description": "TCE - Relatório Temático nº 36/2023 - Créditos Adicionais - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020376/2023-54",
        "sei_number": "1190.01.0020376/2023-54",
        "description": "TCE - Relatório Temático nº 37/2023 - Serviço da Dívida - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020435/2023-13",
        "sei_number": "1190.01.0020435/2023-13",
        "description": "TCE - Relatório Temático nº 41/2023 - Planejamento - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020448/2023-50",
        "sei_number": "1190.01.0020448/2023-50",
        "description": "TCE - Relatório Temático nº 42/2023 - Mineração - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020686/2023-26",
        "sei_number": "1190.01.0020686/2023-26",
        "description": "TCE - Relatório Temático nº 47/2023 - ASPS - Ações e Serviços Públicos de Saúde e Termo de Acordo Saúde - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020695/2023-74",
        "sei_number": "1190.01.0020695/2023-74",
        "description": "TCE - Relatório Temático nº 48/2023 - Receita e Despesa Fiscal - 4º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020768/2023-43",
        "sei_number": "1190.01.0020768/2023-43",
        "description": "TCE - Relatório Temático nº 45/2023 - Recursos Vinculados por Determinação Constitucional ou Legal - Educação - 4º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1630.01.0003095/2023-59",
        "sei_number": "1630.01.0003095/2023-59",
        "description": "TCE - Informa que o gasto com pessoal do Poder Executivo Estadual ultrapassou os limites máximo, prudencial e de alerta no 1° quadrimestre de 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459836/2023-80",
        "sei_number": "1500.01.0459836/2023-80",
        "description": "TCE - Atingimento das metas previstas no Plano Estadual de Educação (PEE)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459859/2023-41",
        "sei_number": "1500.01.0459859/2023-41",
        "description": "TCE - Cota Concedida para a Fapemig - Exercícios 2021 a 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459804/2023-71",
        "sei_number": "1500.01.0459804/2023-71",
        "description": "TCE - Dívida Ativa, Créditos Tributários e Não Tributários a inscrever em Dívida Ativa, Renúncia de Receitas e Precatórios",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459832/2023-91",
        "sei_number": "1500.01.0459832/2023-91",
        "description": "TCE - Situação do atingimento das metas previstas para cada um dos indicadores dos objetivos estratégicos do Plano Mineiro de Desenvolvimento Integrado (PMDI) até dezembro de 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459817/2023-11",
        "sei_number": "1500.01.0459817/2023-11",
        "description": "TCE - Segurança Pública",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459862/2023-57",
        "sei_number": "1500.01.0459862/2023-57",
        "description": "TCE - Gastos com Publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0000070/2024-69",
        "sei_number": "1190.01.0000070/2024-69",
        "description": "TCE - Relatório Temático nº 25/2023 - Fapemig - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000077/2024-74",
        "sei_number": "1190.01.0000077/2024-74",
        "description": "TCE - Relatório Temático nº 27/2023 - Mecanismo de Ajuste Fiscal - 4º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000081/2024-63",
        "sei_number": "1190.01.0000081/2024-63",
        "description": "TCE - Relatório Temático nº 29/2023 - Dívida Ativa - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000082/2024-36",
        "sei_number": "1190.01.0000082/2024-36",
        "description": "TCE - Relatório Temático nº 30/2023 - Precatório - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000088/2024-68",
        "sei_number": "1190.01.0000088/2024-68",
        "description": "TCE - Relatório Temático nº 31/2023 - Renúncia de Receita - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000089/2024-41",
        "sei_number": "1190.01.0000089/2024-41",
        "description": "TCE - Relatório Temático nº 33/2023 - Orçamento de Investimento das Empresas Controladas pelo Estado - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000095/2024-73",
        "sei_number": "1190.01.0000095/2024-73",
        "description": "TCE - Relatório Temático nº 34/2023 - Publicidade - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0445925/2023-93",
        "sei_number": "1500.01.0445925/2023-93",
        "description": "TCE - Relatórios Temáticos - R25 a R34/R25 - Fapemig / R26 Função Educação / R27 Mecanismo de Ajuste Fiscal / R28 Pessoal e Previdência / R29 Dívida Ativa / R30 Precatórios / R31 Renúncia de Receita / R32 Receita Corrente Líquida / R33 Orçamento de Investimento / R34 Publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0019949/2023-40",
        "sei_number": "1190.01.0019949/2023-40",
        "description": "TCE - Relatório Temático nº 09/2023 Planejamento 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020964/2023-86",
        "sei_number": "1190.01.0020964/2023-86",
        "description": "TCE - Relatório Temático nº 13/2023 - Execução da LOA",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0000408/2024-61",
        "sei_number": "1190.01.0000408/2024-61",
        "description": "TCE - Relatório Temático nº 46 - Execução da LOA - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020963/2023-16",
        "sei_number": "1190.01.0020963/2023-16",
        "description": "TCE - Relatório Temático nº 12/2023 - Emendas Parlamentares de Execução Obrigatória - 1º semestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0000578/2024-30",
        "sei_number": "1190.01.0000578/2024-30",
        "description": "TCE - Relatório Temático nº 38/2023 - Balanço Orçamentário - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000467/2024-20",
        "sei_number": "1190.01.0000467/2024-20",
        "description": "TCE - Dados do módulo Folha de Pagamento do SICOM - CNPJ nº 18.715.615/0001-60",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000652/2024-69",
        "sei_number": "1190.01.0000652/2024-69",
        "description": "Relatório Temático nº 40/2023 - Economia",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000645/2024-64",
        "sei_number": "1190.01.0000645/2024-64",
        "description": "TCE - Relatório Temático nº 35/2023 - Segurança Pública - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000651/2024-96",
        "sei_number": "1190.01.0000651/2024-96",
        "description": "TCE - Relatório Temático nº 39/2023 - Restos a Pagar - 2º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000654/2024-15",
        "sei_number": "1190.01.0000654/2024-15",
        "description": "TCE - Relatório Temático nº 43/2023 - Mecanismos de Ajuste Fiscal - 5º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0445929/2023-82",
        "sei_number": "1500.01.0445929/2023-82",
        "description": "TCE - Relatórios Temáticos - R35 a R43/R35 - Segurança Pública / R36 - Créditos Adicionais / R37 - Serviço da Dívida / R38 - Balanço Orçamentário / R39 - Restos a Pagar / R40 - Economia / R41 - Planejamento Governamental/R42 - Mineração / R43 Mecanismo de Ajuste Fiscal (5° Bimestre)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0020960/2023-97",
        "sei_number": "1190.01.0020960/2023-97",
        "description": "TCE - Relatório Temático nº 11/2023 - Créditos Adicionais - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1500.01.0459840/2023-69",
        "sei_number": "1500.01.0459840/2023-69",
        "description": "TCE - Relatórios Temáticos - R44 a R48/R44 Economia / R45 - Educação / R46 - Execução da LOA / R47ASPS / R48 Receita e Despesa Fiscal",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0000831/2024-86",
        "sei_number": "1190.01.0000831/2024-86",
        "description": "TCE - Relatório Temático nº 44/2023 - Economia - 3º trimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000169/2024-15",
        "sei_number": "1190.01.0000169/2024-15",
        "description": "TCE - Dívida Ativa, Créditos Tributários e Não Tributários a inscrever em Dívida Ativa, Renúncia de Receitas e Precatórios - SRE solicita dilação do prazo para resposta",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0019731/2024-24",
        "sei_number": "1500.01.0019731/2024-24",
        "description": "TCE - Informações Saúde - TDCOs, Acordos e ASPS",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0019745/2024-34",
        "sei_number": "1500.01.0019745/2024-34",
        "description": "TCE - Informações sobre pessoal da administração direta, autárquica e nas empresas estatais dependentes e sobre despesas empenhadas tendo como favorecidas Organizações da Sociedade Civil (OSCs) e Organizações da Sociedade Civil de Interesse Público (OSCIPs)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0001301/2024-06",
        "sei_number": "1190.01.0001301/2024-06",
        "description": "TCE - Solicita informações Acordo da Vale - Recebimento de valores pendentes, correção de valores e demonstrativo de rendimentos",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0440931/2023-04",
        "sei_number": "1500.01.0440931/2023-04",
        "description": "TCE - DETRAN - Estudo quanto à modelagem contratual adequada para fins de registro de contratos de garantias de alienação fiduciária, com estabelecimento do preço público devido pela prestação do serviço",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Denúncia",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0002417/2024-41",
        "sei_number": "1190.01.0002417/2024-41",
        "description": "TCE - Dívidas por contrato",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0050464/2024-68",
        "sei_number": "1500.01.0050464/2024-68",
        "description": "TCE - Termo de Compromisso Definitivo celebrado em razão do transbordamento do Dique Lisa da Mina Pau Branco",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0000258/2024-25",
        "sei_number": "1630.01.0000258/2024-25",
        "description": "SECGERAL - TCE - Informações sobre a implementação de projetos que integram os Anexos II.3, III e IV do Acordo Judicial de Reparação dos danos decorrentes do rompimento de barragens da Vale S.A. em Brumadinho",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "1080.01.0003291/2024-17",
        "sei_number": "1080.01.0003291/2024-17",
        "description": "AGE - Para atendimento ao TCE - Relatório dos pagamentos de precatórios e sentenças judiciais, inclusive os RPVs, referentes ao Tribunal de Justiça e ao Tribunal Regional do Trabalho, realizados no exercício de 2023, com especificações do credor, do número do precatório, da data de pagamento, do valor bruto, do valor líquido e da fonte pagadora",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004293/2024-23",
        "sei_number": "1190.01.0004293/2024-23",
        "description": "TCE - Gastos com Publicidade da PMMG - Exercício 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004303/2024-44",
        "sei_number": "1190.01.0004303/2024-44",
        "description": "TCE - Despesas MDE - Critérios para repasse de recursos do Tesouro Estadual às Universidades Federais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004318/2024-27",
        "sei_number": "1190.01.0004318/2024-27",
        "description": "TCE - Estoque da Dívida e Regime de Recuperação Fiscal (RRF)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004329/2024-21",
        "sei_number": "1190.01.0004329/2024-21",
        "description": "TCE - Acordo FES",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004331/2024-64",
        "sei_number": "1190.01.0004331/2024-64",
        "description": "TCE - Repasses da União para pagamento do vencimento dos agentes comunitários de saúde e dos agentes de combate às endemias",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0004337/2024-96",
        "sei_number": "1190.01.0004337/2024-96",
        "description": "TCE - Saldo em aberto de Restos a Pagar do exercício de 2021 - Emendas de blocos e bancadas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1080.01.0020985/2024-04",
        "sei_number": "1080.01.0020985/2024-04",
        "description": "TCE - AGE - Acompanhamento da efetivação do Plano Anual de Pagamentos de Precatórios para 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0005002/2024-86",
        "sei_number": "1190.01.0005002/2024-86",
        "description": "Trabalho de revisão das demonstrações financeiras da Unidade Orçamentária 1191 - SEF, referentes ao exercício de 2023.",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0005150/2024-67",
        "sei_number": "1190.01.0005150/2024-67",
        "description": "SEF - Minuta de resolução conjunta - Dispõe sobre a ordem cronológica de pagamento das obrigações relativas ao fornecimento de bens, locações, prestação de serviços e realização de obras, pelos órgãos e entidades integrantes da Administração Pública estadual direta, autárquica e fundacional do Poder Executivo",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "24.0.000002320-1",
        "sei_number": "24.0.000002320-1",
        "description": "TCE - Valores de pagamento de Férias - Prêmio - Exercícios de 2017 e 2018",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000002314-7",
        "sei_number": "24.0.000002314-7",
        "description": "TCE - Disponibilidade de Caixa para os recursos vinculados em ASPS e MDE - Composição dos Recursos Não Vinculados de Impostos, dos Vinculados à Saúde e dos Vinculados à Educação",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0005459/2024-66",
        "sei_number": "1190.01.0005459/2024-66",
        "description": "TCE - Balanço Geral do Estado 2023",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0006293/2024-52",
        "sei_number": "1190.01.0006293/2024-52",
        "description": "TCE - Trabalho de auditoria financeira da Dívida Ativa",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "24.0.000002318-0",
        "sei_number": "24.0.000002318-0",
        "description": "TCE - Repasses da assistência financeira complementar da União destinada ao cumprimento do piso salarial nacional de enfermeiros, técnicos e auxiliares de enfermagem e parteiras",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1320.01.0009530/2022-26",
        "sei_number": "1320.01.0009530/2022-26",
        "description": "SES - Determinação TCE - Recomposição dos índices de ASPS - Termo de Compromisso - Exercício 2018",
        "assigned_to": "evelyne.sousa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2022
    },
    {
        "id": "1190.01.0006234/2024-93",
        "sei_number": "1190.01.0006234/2024-93",
        "description": "TCE - Auditoria Operacional - Efetividade da fiscalização ambiental dos empreendimentos de minério de ferro realizada pelo SISEMA",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "24.0.000003026-7",
        "sei_number": "24.0.000003026-7",
        "description": "TCE - Solicita o encaminhamento de NT - Reconhecimento das provisões matemáticas previdenciárias apuradas com data-base no encerramento dos exercícios, nos balanços patrimoniais respectivos, e, consequentemente, nos balanços consolidados do Estado",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1220.01.0001697/2024-89",
        "sei_number": "1220.01.0001697/2024-89",
        "description": "SEDE - Recomendação TCE - Repasse de percentual total de receita arrecadada de CFEM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008513/2024-58",
        "sei_number": "1190.01.0008513/2024-58",
        "description": "SEPLAG/SPLOR - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008517/2024-47",
        "sei_number": "1190.01.0008517/2024-47",
        "description": "ALMG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008518/2024-20",
        "sei_number": "1190.01.0008518/2024-20",
        "description": "SEPLAG/SIGES - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008560/2024-50",
        "sei_number": "1190.01.0008560/2024-50",
        "description": "SEPLAG/Comitê Pró-Brumadinho -TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008557/2024-34",
        "sei_number": "1190.01.0008557/2024-34",
        "description": "SEPLAG/SUGESP - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008572/2024-17",
        "sei_number": "1190.01.0008572/2024-17",
        "description": "SECULT - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008576/2024-06",
        "sei_number": "1190.01.0008576/2024-06",
        "description": "FAPEMIG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008578/2024-49",
        "sei_number": "1190.01.0008578/2024-49",
        "description": "SEGOV - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008586/2024-27",
        "sei_number": "1190.01.0008586/2024-27",
        "description": "SCC - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008589/2024-43",
        "sei_number": "1190.01.0008589/2024-43",
        "description": "IPLEMG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008598/2024-91",
        "sei_number": "1190.01.0008598/2024-91",
        "description": "FEAM - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008601/2024-10",
        "sei_number": "1190.01.0008601/2024-10",
        "description": "SEF/SRE - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008615/2024-20",
        "sei_number": "1190.01.0008615/2024-20",
        "description": "AGE - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008625/2024-41",
        "sei_number": "1190.01.0008625/2024-41",
        "description": "SEE - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008628/2024-57",
        "sei_number": "1190.01.0008628/2024-57",
        "description": "SES - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008579/2024-22",
        "sei_number": "1190.01.0008579/2024-22",
        "description": "SEF/SCAF - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008567/2024-55",
        "sei_number": "1190.01.0008567/2024-55",
        "description": "SCCG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008663/2024-82",
        "sei_number": "1190.01.0008663/2024-82",
        "description": "IPSEMG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008703/2024-69",
        "sei_number": "1190.01.0008703/2024-69",
        "description": "CBMMG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008715/2024-36",
        "sei_number": "1190.01.0008715/2024-36",
        "description": "IPSM - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008708/2024-31",
        "sei_number": "1190.01.0008708/2024-31",
        "description": "PMMG - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0007893/2024-17",
        "sei_number": "1190.01.0007893/2024-17",
        "description": "TCE - Dívida Ativa, Créditos Tributários e Não Tributários a inscrever em Dívida Ativa, Renúncia de Receitas e Precatórios - SRE retifica as informações",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000003587-0",
        "sei_number": "24.0.000003587-0",
        "description": "TCE - Regularização dos Créditos Tributários e dos Precatórios no SIAFI",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000003590-0",
        "sei_number": "24.0.000003590-0",
        "description": "TCE - Solicita o encaminhamento das metas bimestrais de arrecadação para o exercício de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008721/2024-68",
        "sei_number": "1190.01.0008721/2024-68",
        "description": "SEF/COPREV - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008746/2024-72",
        "sei_number": "1190.01.0008746/2024-72",
        "description": "COFIN - TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000003588-9",
        "sei_number": "24.0.000003588-9",
        "description": "TCE - Providências para o cumprimento da Decisão Normativa nº 01/2024 - Define o critério para atualização monetária do valor residual que deixou de ser alocado pelo Estado e pelos Municípios em Manutenção e Desenvolvimento do Ensino - MDE nos exercícios financeiros de 2020 e 2021 e dá outras providências",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0005226/2024-52",
        "sei_number": "1190.01.0005226/2024-52",
        "description": "STE - Nota Técnica - Valores para compensação em Ações e Serviços Públicos de Saúde ASPS - Exercício 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000003589-7",
        "sei_number": "24.0.000003589-7",
        "description": "TCE - Solicita informações acerca do Regime Especial e requer acesso ao SIARE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0010776/2024-67",
        "sei_number": "1190.01.0010776/2024-67",
        "description": "TCE - Intimação - Solicita que seja apresentada a memória de cálculo, a justificativa e a aplicação da correção monetária de que trata o estudo que a CFAMGE fez sobre o repasses de recursos da Qese à SEE/MG",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001189/2022-17",
        "sei_number": "1630.01.0001189/2022-17",
        "description": "TCE - Prestação de Contas do Governador - Parecer Prévio - Exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2022
    },
    {
        "id": "24.0.000004152-8",
        "sei_number": "24.0.000004152-8",
        "description": "TCE - Regime de Recuperação Fiscal (RRF) e Dívida Pública",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0011297/2024-65",
        "sei_number": "1190.01.0011297/2024-65",
        "description": "TCE - Proposta de Termo de Compromisso - Ações e Serviços Públicos de Saúde (ASPS)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0011330/2024-47",
        "sei_number": "1190.01.0011330/2024-47",
        "description": "TCE - Proposta de Termo Compromisso - Manutenção do Desenvolvimento do Ensino (MDE)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0008989/2024-10",
        "sei_number": "1190.01.0008989/2024-10",
        "description": "TCE - Funcionalidade para automação no cadastro de dados de retenção de tributos federais - Sistema EFD-REINF",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0000806/2024-70",
        "sei_number": "1630.01.0000806/2024-70",
        "description": "TCE - Balanço Geral do Estado nº 1.167.016 - Exercício de 2023 - Abertura de Vistas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0000979/2024-55",
        "sei_number": "1630.01.0000979/2024-55",
        "description": "TCE - Relatório de Acompanhamento do Projeto de Lei de Diretrizes Orçamentárias de Minas Gerais para o exercício de 2025 - PLDO 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0011630/2024-95",
        "sei_number": "1190.01.0011630/2024-95",
        "description": "TCE - BGE 2020 - Repasse ao Fundeb da quantia de R$ 774.703.416,03, relativa aos recursos decorrentes da alíquota adicional do ICMS, prevista no art. 82, § 1º, do ADCT, do período de 2012 a 2020 - Divergências entre os valores apurados pelo TCE e os calculados pela SEF",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0011696/2024-59",
        "sei_number": "1190.01.0011696/2024-59",
        "description": "TCE - Intimação - Solicita que seja apresentada a memória de cálculo, a justificativa e a aplicação da correção monetária de que trata o estudo que a CFAMGE fez sobre o repasses de recursos da Qese à SEE/MG - Manifestação SCAF",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0011724/2024-79",
        "sei_number": "1190.01.0011724/2024-79",
        "description": "TCE - Intimação - Solicita que seja apresentada a memória de cálculo, a justificativa e a aplicação da correção monetária de que trata o estudo que a CFAMGE fez sobre o repasses de recursos da Qese à SEE/MG - Manifestação SEE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001093/2024-81",
        "sei_number": "1630.01.0001093/2024-81",
        "description": "TCE - Representação nº 1.167.109 - Suposta omissão do Poder Executivo na regulamentação do ICMS Educacional",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "1220.01.0002060/2024-85",
        "sei_number": "1220.01.0002060/2024-85",
        "description": "TCE - Demonstrativos da Execução do Orçamento de Investimento das Empresas Controladas - 1º Quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "24.0.000004744-5",
        "sei_number": "24.0.000004744-5",
        "description": "TCE - Relatório Temático nº 1/2024 - Mecanismo de Ajuste Fiscal - 1º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001158/2024-72",
        "sei_number": "1630.01.0001158/2024-72",
        "description": "SECGERAL - TCE - BGE 2020 - Repasse ao Fundeb da quantia de R$ 774.703.416,03, relativa aos recursos decorrentes da alíquota adicional do ICMS, prevista no art. 82, § 1º, do ADCT, do período de 2012 a 2020 - Divergências entre os valores apurados pelo TCE e os calculados pela SEF",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000005170-1",
        "sei_number": "24.0.000005170-1",
        "description": "TCE - Relatório Temático nº 02/2024 - Receita Corrente Líquida - 2º Bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1080.01.0059851/2024-65",
        "sei_number": "1080.01.0059851/2024-65",
        "description": "TCE - Representação - Processo nº 1053903 - Antecipação do prazo de recolhimento do ICMS devido nas operações próprias do gerador, transmissor ou distribuidor de energia elétrica, realizadas em novembro e dezembro de 2018",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "24.0.000005491-3",
        "sei_number": "24.0.000005491-3",
        "description": "TCE - Relatório Temático nº 03/2023 - Função Educação 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000005492-1",
        "sei_number": "24.0.000005492-1",
        "description": "TCE - Relatório Temático nº 04/2024 Créditos Adicionais 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000005488-3",
        "sei_number": "24.0.000005488-3",
        "description": "TCE - Informações para o Relatório Temático - Função Saúde 1º Quadrimestre 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001209/2024-53",
        "sei_number": "1630.01.0001209/2024-53",
        "description": "TCE - Prestação de Contas do Governador - Parecer Prévio - Exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000005787-4",
        "sei_number": "24.0.000005787-4",
        "description": "TCE - Solicita informações - Reforma Tributária",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0014611/2024-21",
        "sei_number": "1190.01.0014611/2024-21",
        "description": "SEF - Definição de prazo para atendimento das demandas oriundas do TCE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001329/2024-14",
        "sei_number": "1630.01.0001329/2024-14",
        "description": "SECGERAL - Ministério Público de Contas - Notícia de Irregularidade nº 082.2024.854 - Prestação de dados contábeis, orçamentários e fiscais, via SICONFI e SIOPE, como pré-requisitos para o recebimento da complementação do VAAT",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015141/2024-67",
        "sei_number": "1190.01.0015141/2024-67",
        "description": "SEE - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021 - Agosto 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015142/2024-40",
        "sei_number": "1190.01.0015142/2024-40",
        "description": "SECOM - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021 - Agosto 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015153/2024-34",
        "sei_number": "1190.01.0015153/2024-34",
        "description": "SEDE - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021 - Agosto 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015390/2024-37",
        "sei_number": "1190.01.0015390/2024-37",
        "description": "TCE - Processo nº 1.147.778 - Proposta de cronograma de pagamento - Termo de Compromisso Único - MDE e ASPS",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Monitoramento",
        "ref_year": 2024
    },
    {
        "id": "24.0.000006299-1",
        "sei_number": "24.0.000006299-1",
        "description": "TCE - Questionários eletrônicos referentes ao Índice de Efetividade da Gestão Estadual IEGE 2024 (exercício 2023)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015475/2024-70",
        "sei_number": "1190.01.0015475/2024-70",
        "description": "COPREV - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0014116/2024-97",
        "sei_number": "1190.01.0014116/2024-97",
        "description": "SEF/GAB - TCE - Planilha de controle das determinações e recomendações - Balanço Geral 2021 e exercícios anteriores - Avaliação do cumprimento por parte da CFAMGE",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0467475/2024-46",
        "sei_number": "1500.01.0467475/2024-46",
        "description": "TCE - Tomada de Contas Especial - Cartas-Trava",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Tomada de Contas Especial",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015708/2024-84",
        "sei_number": "1190.01.0015708/2024-84",
        "description": "SRE - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015725/2024-13",
        "sei_number": "1190.01.0015725/2024-13",
        "description": "SEPLAG - Monitoramento das recomendações e determinações constantes no Pareceres Prévios relativos aos exercícios 2021 e 2020",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015875/2024-37",
        "sei_number": "1190.01.0015875/2024-37",
        "description": "SCGOV - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0015911/2024-35",
        "sei_number": "1190.01.0015911/2024-35",
        "description": "SCAF - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000006298-3",
        "sei_number": "24.0.000006298-3",
        "description": "TCE - Informações atualizadas sobre Férias-Prêmio",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000006497-8",
        "sei_number": "24.0.000006497-8",
        "description": "TCE - Informações sobre o Sistema Estadual de Monitoramento e Avaliação de Políticas Públicas - Sapp-MG",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0016142/2024-06",
        "sei_number": "1190.01.0016142/2024-06",
        "description": "TCE - Questionário IEGE 2024 (exercício 2023) - iFiscal",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0016616/2024-12",
        "sei_number": "1190.01.0016616/2024-12",
        "description": "SCCG - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007094-3",
        "sei_number": "24.0.000007094-3",
        "description": "TCE - Relatório Temático nº 21/2024 - Dívida Ativa - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007098-6",
        "sei_number": "24.0.000007098-6",
        "description": "TCE - Relatório Temático nº 23/2024 - Orçamento de Investimento das Empresas Controladas pelo Estado - 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007065-0",
        "sei_number": "24.0.000007065-0",
        "description": "TCE - Relatório Temático nº 08/2024 - Renúncia de Receita - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007066-8",
        "sei_number": "24.0.000007066-8",
        "description": "TCE - Relatório Temático nº 06/2024 - Planejamento - 1º Quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007107-9",
        "sei_number": "24.0.000007107-9",
        "description": "TCE - Relatório Temático nº 20/2024 - Operações de Crédito, Garantias e Contragarantias, Dívida Consolidada Líquida e Resultados Primário e Nominal - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007108-7",
        "sei_number": "24.0.000007108-7",
        "description": "TCE - Relatório Temático nº 15/2024  Execução Orçamentária 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007105-2",
        "sei_number": "24.0.000007105-2",
        "description": "TCE - Relatório Temático nº 14/2024 - ASPS - Ações e Serviços Públicos de Saúde e Termo de Acordo Saúde - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007099-4",
        "sei_number": "24.0.000007099-4",
        "description": "Relatório Temático nº 24/2024 - Balanço Patrimonial",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007092-7",
        "sei_number": "24.0.000007092-7",
        "description": "TCE - Relatório Temático nº 17/2024 - Precatório - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007095-1",
        "sei_number": "24.0.000007095-1",
        "description": "TCE - Relatório Temático nº 22/2024 - Receita e Despesa Fiscal - 2º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007093-5",
        "sei_number": "24.0.000007093-5",
        "description": "TCE - Relatório Temático nº 25/2024 - Emendas Parlamentares de Execução Obrigatória - 1º semestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007101-0",
        "sei_number": "24.0.000007101-0",
        "description": "TCE - Relatório Temático nº 19/2024 - Mineração - 1º semestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007109-5",
        "sei_number": "24.0.000007109-5",
        "description": "TCE - Relatório Temático nº 16/2024 - Recursos Vinculados por Determinação Constitucional ou Legal - Educação - 2º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007067-6",
        "sei_number": "24.0.000007067-6",
        "description": "TCE - Relatório Temático nº 09/2024 - Mecanismo de Ajuste Fiscal - 2º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007302-0",
        "sei_number": "24.0.000007302-0",
        "description": "TCE - Relatório Temático nº 26/2024 - FAPEMIG - 1º semestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007106-0",
        "sei_number": "24.0.000007106-0",
        "description": "TCE - Relatório Temático nº 18/2024 - Conjuntura Econômica - 1º trimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007071-4",
        "sei_number": "24.0.000007071-4",
        "description": "TCE - Relatório Temático nº 13/2024 - Balanço Orçamentário - 1º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007069-2",
        "sei_number": "24.0.000007069-2",
        "description": "TCE - Relatório Temático nº 10/2024 - Mecanismo de Ajuste Fiscal - 3º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007064-1",
        "sei_number": "24.0.000007064-1",
        "description": "TCE - Relatório Temático nº 07/2024 - Despesa com Pessoal 1º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0018007/2024-91",
        "sei_number": "1190.01.0018007/2024-91",
        "description": "TCE - Solicitação de Dilação de Prazo do RT 12/2024 Segurança Pública",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007650-0",
        "sei_number": "24.0.000007650-0",
        "description": "TCE - SCCG - Riscos classificados e mensurados, pela AGE, como prováveis",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0017910/2024-91",
        "sei_number": "1190.01.0017910/2024-91",
        "description": "TCE - Dilação de prazo RT Mineração 1º trimestre 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0018510/2024-90",
        "sei_number": "1190.01.0018510/2024-90",
        "description": "TCE - RT-Publicidade - 05/2024 - 1º quadrimestre - Pedido de manifestação para a SEJUSP sobre o FESP",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007298-9",
        "sei_number": "24.0.000007298-9",
        "description": "TCE - Relatório Temático nº 12/2024 - Segurança Pública - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007321-7",
        "sei_number": "24.0.000007321-7",
        "description": "TCE - Relatório Temático nº 05/2024 - Publicidade - 1º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019363/2024-48",
        "sei_number": "1190.01.0019363/2024-48",
        "description": "SEPLAG - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019438/2024-60",
        "sei_number": "1190.01.0019438/2024-60",
        "description": "SCAF - Monitoramento das recomendações e determinações constantes nos Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019442/2024-49",
        "sei_number": "1190.01.0019442/2024-49",
        "description": "SCCG - Monitoramento das recomendações e determinações constantes nos Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019444/2024-92",
        "sei_number": "1190.01.0019444/2024-92",
        "description": "COPREV - Monitoramento das recomendações e determinações constantes nos Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019468/2024-26",
        "sei_number": "1190.01.0019468/2024-26",
        "description": "SEGOV - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019477/2024-74",
        "sei_number": "1190.01.0019477/2024-74",
        "description": "SRE - Monitoramento das recomendações e determinações constantes nos Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019486/2024-25",
        "sei_number": "1190.01.0019486/2024-25",
        "description": "SEDESE - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019484/2024-79",
        "sei_number": "1190.01.0019484/2024-79",
        "description": "SEE - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019491/2024-84",
        "sei_number": "1190.01.0019491/2024-84",
        "description": "SEJUSP - Monitoramento das recomendações e determinações constantes nos Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008239-9",
        "sei_number": "24.0.000008239-9",
        "description": "TCE - Informações sobre empenho - Empresa de Pesquisa Agropecuária de Minas Gerais Epamig",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019635/2024-76",
        "sei_number": "1190.01.0019635/2024-76",
        "description": "HEMOMINAS - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019639/2024-65",
        "sei_number": "1190.01.0019639/2024-65",
        "description": "CEE - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019630/2024-17",
        "sei_number": "1190.01.0019630/2024-17",
        "description": "FEAM - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019640/2024-38",
        "sei_number": "1190.01.0019640/2024-38",
        "description": "SECOM - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008323-9",
        "sei_number": "24.0.000008323-9",
        "description": "TCE - Relatório Temático nº 28/2024 - Publicidade - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008326-3",
        "sei_number": "24.0.000008326-3",
        "description": "TCE - Relatório Temático nº 29/2024 - Função Educação - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008328-0",
        "sei_number": "24.0.000008328-0",
        "description": "TCE - Relatório Temático nº 32/2024 - Precatório - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008327-1",
        "sei_number": "24.0.000008327-1",
        "description": "TCE - Relatório Temático nº 30/2024 - Créditos Adicionais - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019821/2024-98",
        "sei_number": "1190.01.0019821/2024-98",
        "description": "TJMG - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008339-5",
        "sei_number": "24.0.000008339-5",
        "description": "TCE - Relatório Temático nº 27/2024 - FAPEMIG - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008325-5",
        "sei_number": "24.0.000008325-5",
        "description": "TCE - Relatório Temático nº 31/2024 - Planejamento - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008403-0",
        "sei_number": "24.0.000008403-0",
        "description": "TCE - Revisão SEF 2023 - Relatório Preliminar - Demonstrações contábeis da Unidade Orçamentária 1191",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020034/2024-70",
        "sei_number": "1190.01.0020034/2024-70",
        "description": "SCC - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001439/2023-54",
        "sei_number": "1630.01.0001439/2023-54",
        "description": "TCE - Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "1190.01.0012935/2024-71",
        "sei_number": "1190.01.0012935/2024-71",
        "description": "SEF/GAB - Comunica ciclo de atendimento das demandas do Tribunal de Contas do Estado relativas ao Balanço Geral do EstadO",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001653/2022-02",
        "sei_number": "1630.01.0001653/2022-02",
        "description": "AGE - TCE - Solicitação de subsídios - Acórdão RO 1168121 - Denúncia nº 1119845 - Processo nº 1177697",
        "assigned_to": "evelyne.sousa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Denúncia",
        "ref_year": 2022
    },
    {
        "id": "24.0.000008554-1",
        "sei_number": "24.0.000008554-1",
        "description": "TCE - Relatório Temático nº 33/2024 - Receita Corrente Líquida - 4º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008555-0",
        "sei_number": "24.0.000008555-0",
        "description": "TCE - Relatório Temático nº 34/2024 - Despesa com Pessoal e a Previdência Social do Servidor Público - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000007675-5",
        "sei_number": "24.0.000007675-5",
        "description": "TCE - 2º Relatório de Acompanhamento do Regime de Recuperação Fiscal do Estado de Minas Gerais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008585-1",
        "sei_number": "24.0.000008585-1",
        "description": "TCE - Relatório Temático nº 35/2024 - Restos a Pagar - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020556/2024-41",
        "sei_number": "1190.01.0020556/2024-41",
        "description": "SEGOV - TCE - Monitoramento das recomendações e determinações constantes no Parecer Prévio relativo ao exercício 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020936/2024-63",
        "sei_number": "1190.01.0020936/2024-63",
        "description": "SEF - TCE - 1º ciclo de monitoramento das recomendações e determinações constantes no Parecer Prévio 2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020940/2024-52",
        "sei_number": "1190.01.0020940/2024-52",
        "description": "TCE - Relatório Temático nº 38/2024 - Orçamento de Investimentos das Empresas Controladas pelo Estado - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008716-1",
        "sei_number": "24.0.000008716-1",
        "description": "TCE - Relatório Temático nº 37/2024 - Economia - 2º trimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008749-8",
        "sei_number": "24.0.000008749-8",
        "description": "TCE - Relatório Temático nº 40/2024 - Segurança Pública - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020659/2024-73",
        "sei_number": "1190.01.0020659/2024-73",
        "description": "COPREV - Monitoramento dos apontamentos do TCE - Parecer Prévio 2022 - Impactos que serão provocados caso seja acatado o apontamento de não limitação do percentual da alíquota da Contribuição Patronal Suplementar, prevista no art. 28-A da LC 64, de 2002",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0016862/2023-66",
        "sei_number": "1190.01.0016862/2023-66",
        "description": "SEF/GAB - Levantamento da situação das recomendações e determinações do Tribunal de Contas de acordo com seu status de \"não atendidas\" ou \"atendidas parcialmente\",relativo aos exercícios de 2019 e 2020",
        "assigned_to": "evelyne.sousa",
        "deadline": "2023-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2023
    },
    {
        "id": "24.0.000008779-0",
        "sei_number": "24.0.000008779-0",
        "description": "TCE - Segurança Pública - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1080.01.0107903/2024-36",
        "sei_number": "1080.01.0107903/2024-36",
        "description": "Resolução Conjunta SEC-GERAL/AGE/CGE/SEF nº 01/2024 - Fluxo de demandas advindas do Tribunal de Contas do Estado",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008837-0",
        "sei_number": "24.0.000008837-0",
        "description": "TCE - Gastos efetuados com recursos da Fonte 32 - Cfem",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008778-1",
        "sei_number": "24.0.000008778-1",
        "description": "TCE - Gastos com Publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008840-0",
        "sei_number": "24.0.000008840-0",
        "description": "TCE - Informações sobre a situação do atingimento das metas previstas para cada um dos indicadores dos objetivos estratégicos do Plano Mineiro de Desenvolvimento Integrado PMDI até dezembro de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008741-2",
        "sei_number": "24.0.000008741-2",
        "description": "TCE - Relatório Temático nº 39/2024 - Mecanismo de Ajuste Fiscal - 4º bimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020914/2024-75",
        "sei_number": "1190.01.0020914/2024-75",
        "description": "TCE - Relatório Temático nº 36/2024 - Ações e Serviços Públicos de Saúde e Termo de Acordo Saúde 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0001653/2024-93",
        "sei_number": "1630.01.0001653/2024-93",
        "description": "Resolução Conjunta Sec-Geral/Age/Cge/Sef nº 01/2024 - Dispõe sobre o fluxo a ser observado em demanda que tramite perante o Tribunal de Contas do Estado de Minas Gerais e que figure como parte a Administração Pública Direta ou Indireta do Poder Executivo Estadual",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008842-7",
        "sei_number": "24.0.000008842-7",
        "description": "TCE - Relatório Temático nº 41/2024 - Mineração - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008839-7",
        "sei_number": "24.0.000008839-7",
        "description": "TCE - Educação - Dados do exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0021726/2024-73",
        "sei_number": "1190.01.0021726/2024-73",
        "description": "MPMG - TCE - Gastos com Publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0021724/2024-30",
        "sei_number": "1190.01.0021724/2024-30",
        "description": "TJMG - TCE - Gastos com Publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0019766/2024-31",
        "sei_number": "1190.01.0019766/2024-31",
        "description": "AGE - TCE - Monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000008992-0",
        "sei_number": "24.0.000008992-0",
        "description": "TCE - Relatório Temático nº 42/2024 - Balanço Orçamentário - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0009942/2024-81",
        "sei_number": "1190.01.0009942/2024-81",
        "description": "RESOLUÇÃO CONJUNTA SEF/AGE/TJ de Nº 5836, DE 11 DE OUTUBRO DE 2024 - Altera a Resolução Conjunta SEF/AGE/TJ Nº 5799, DE 12 DE JUNHO DE 2024, que dispõe sobre a constituição do Grupo de Trabalho GT conjunto SEF/MG, AGE/MG e TJ/MG, designa os membros titulares e suplentes e dá prazo.",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009087-1",
        "sei_number": "24.0.000009087-1",
        "description": "TCE - Solicita disponibilização de acesso ao Armazém de Informações - BO do Siafi-MG",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009080-4",
        "sei_number": "24.0.000009080-4",
        "description": "TCE - Gestão das empresas estatais, dependentes e não dependentes deficitárias",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009078-2",
        "sei_number": "24.0.000009078-2",
        "description": "TCE - Solicita informações sobre a descaracterização de barragens a montante - Relatório publicado pela ANM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0020198/2024-07",
        "sei_number": "1190.01.0020198/2024-07",
        "description": "TCE - Denúncia nº 1.167.114 - Irregularidades inerentes ao serviço de vistoria automotiva no Estado de Minas Gerais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Denúncia",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009075-8",
        "sei_number": "24.0.000009075-8",
        "description": "TCE - Relatório Temático nº 44/2024 - Operações de Crédito, Garantias e Contragarantias, DCL e Resultados Primário e Nominal - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009081-2",
        "sei_number": "24.0.000009081-2",
        "description": "TCE - Relatório Temático nº 46/2024 - Educação Recursos Vinculados por Determinação Constitucional ou Legal - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009076-6",
        "sei_number": "24.0.000009076-6",
        "description": "TCE - Relatório Temático nº 45/2024 - Dívida Ativa - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009092-8",
        "sei_number": "24.0.000009092-8",
        "description": "TCE - Relatório Temático nº 47/2024 - Função Saúde - 2º quadrimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009045-6",
        "sei_number": "24.0.000009045-6",
        "description": "TCE - Relatório Temático nº 43/2024 - Execução da LOA - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1710.01.0000913/2024-80",
        "sei_number": "1710.01.0000913/2024-80",
        "description": "SECOM - Decreto Estadual nº 48.940/2024 - Relatório trimestral sobre os gastos com publicidade",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009188-6",
        "sei_number": "24.0.000009188-6",
        "description": "TCE - Índice constitucional da Educação - Restos a Pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009187-8",
        "sei_number": "24.0.000009187-8",
        "description": "TCE - Índice constitucional da Saúde",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009091-0",
        "sei_number": "24.0.000009091-0",
        "description": "TCE - Relatório Temático nº 48/2024 - Mecanismo de Ajuste Fiscal - 5º bimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000006588-5",
        "sei_number": "24.0.000006588-5",
        "description": "TCE - Proposta Orçamentária de 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009210-6",
        "sei_number": "24.0.000009210-6",
        "description": "TCE - Relatório Temático nº 50/2024 - Economia - 3º trimestre de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009237-8",
        "sei_number": "24.0.000009237-8",
        "description": "TCE - Relatório Temático nº 49/2024 - Receita e Despesa - 4º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009361-7",
        "sei_number": "24.0.000009361-7",
        "description": "TCE - Relatório Temático nº 51/2024 - Renúncia de Receita - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009413-3",
        "sei_number": "24.0.000009413-3",
        "description": "TCE - Renúncias de Receitas - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009412-5",
        "sei_number": "24.0.000009412-5",
        "description": "TCE - Regimes Especiais relativos ao ICMS",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009411-7",
        "sei_number": "24.0.000009411-7",
        "description": "TCE - Execução Orçamentária - Projetos Estratégicos",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009410-9",
        "sei_number": "24.0.000009410-9",
        "description": "TCE - Dívida Pública e Regime de Recuperação Fiscal",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009408-7",
        "sei_number": "24.0.000009408-7",
        "description": "TCE - Relatório anual da execução do orçamento de investimento",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009409-5",
        "sei_number": "24.0.000009409-5",
        "description": "TCE - Precatórios",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009406-0",
        "sei_number": "24.0.000009406-0",
        "description": "TCE - Dívida Ativa e Créditos Tributários e não Tributários a Inscrever em Dívida Ativa",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0000207/2025-53",
        "sei_number": "1190.01.0000207/2025-53",
        "description": "TCE - Relatório Temático nº 45/2024 - Dívida Ativa - 2º quadrimestre - Prorrogação de Prazo",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2025
    },
    {
        "id": "1500.01.0709490/2024-46",
        "sei_number": "1500.01.0709490/2024-46",
        "description": "Ofício SEF/GAB nº. 837/2024. Ofício TCE/MG nº. 23638/2024. Processo TCE/MG nº. 1127857. Acórdão com determinação e recomendação destinadas ao Secretário de Estado de Fazenda. (REPASSES À FAPEMIG)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "25.0.000000154-9",
        "sei_number": "25.0.000000154-9",
        "description": "TCE - Relatório Regime Especiais 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000000265-0",
        "sei_number": "25.0.000000265-0",
        "description": "TCE - Informações complementares - Relatório Temático nº 51/2024 - Renúncia de Receita - 2º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2025
    },
    {
        "id": "24.0.000009407-9",
        "sei_number": "24.0.000009407-9",
        "description": "TCE - Informações sobre os repasses feitos para a Fundação de Amparo à Pesquisa do Estado de Minas Gerais (FAPEMIG)",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1630.01.0002191/2024-20",
        "sei_number": "1630.01.0002191/2024-20",
        "description": "TCE - Auditoria Operacional nº 1.157.403 - Avaliação da segurança de barragens de mineração",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0001053/2025-06",
        "sei_number": "1190.01.0001053/2025-06",
        "description": "SEF/GAB - TCE - 1º ciclo de monitoramento das recomendações e determinações constantes no Parecer Prévio 2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "25.0.000000476-9",
        "sei_number": "25.0.000000476-9",
        "description": "TCE - Contabilização do abono de permanência concedido aos servidores públicos do Estado de Minas Gerais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1080.01.0059023/2024-14",
        "sei_number": "1080.01.0059023/2024-14",
        "description": "TCE - Representação nº 1167174 - Demanda relativa à Lei nº 10.366, de 1990 - Repasse da contribuição patronal - IPSM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "25.0.000000778-4",
        "sei_number": "25.0.000000778-4",
        "description": "TCE - Emendas parlamentares impositivas e Portaria Conjunta STN/SOF nº 20/2021",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "25.0.000000779-2",
        "sei_number": "25.0.000000779-2",
        "description": "TCE - Despesa com Pessoal - Termos de Parceria e Contratos de Gestão",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0022820/2024-23",
        "sei_number": "1190.01.0022820/2024-23",
        "description": "TCE - Dívida Ativa e Créditos Tributários e não Tributários a Inscrever em Dívida Ativa",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "24.0.000009397-8",
        "sei_number": "24.0.000009397-8",
        "description": "TCE - Emendas Parlamentares",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1500.01.0068907/2025-05",
        "sei_number": "1500.01.0068907/2025-05",
        "description": "SEPLAG - Esclarecimentos quanto a pertinência de se enquadrar a política de Acesso Eletivo executada pela Secretaria de Estado de Saúde no rol financiado com recursos do FEM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1080.01.0116413/2024-59",
        "sei_number": "1080.01.0116413/2024-59",
        "description": "TCE - Precatórios",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "25.0.000001223-0",
        "sei_number": "25.0.000001223-0",
        "description": "TCE - Acordo de Repactuação do TTAC de Mariana",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0003217/2025-69",
        "sei_number": "1190.01.0003217/2025-69",
        "description": "SEPLAG - Execução dos valores do Acordo de Brumadinho e Mariana - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0003218/2025-42",
        "sei_number": "1190.01.0003218/2025-42",
        "description": "SEPLAG - Execução da despesa no Fundeb - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000001635-0",
        "sei_number": "25.0.000001635-0",
        "description": "TCE - Recursos recebidos do Fundeb",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000001608-2",
        "sei_number": "25.0.000001608-2",
        "description": "TCE - Mineração - Valores relativos aos hospitais regionais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000001510-8",
        "sei_number": "25.0.000001510-8",
        "description": "TCE - Execução da despesa na Unidade Orçamentária 2071 - Fundação de Amparo à Pesquisa do Estado de Minas Gerais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000001838-7",
        "sei_number": "25.0.000001838-7",
        "description": "TCE - Projeções anuais do Estoque da Dívida e do pagamento do Serviço da Dívida",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0003884/2025-05",
        "sei_number": "1190.01.0003884/2025-05",
        "description": "TCE - Relatório de Revisão das Demonstrações da SEF UO 1191 e Representação nº 1104899 Férias prêmio - Formalização de grupos de trabalho",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004541/2025-17",
        "sei_number": "1190.01.0004541/2025-17",
        "description": "SEPLAG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004683/2025-63",
        "sei_number": "1190.01.0004683/2025-63",
        "description": "PMMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004681/2025-20",
        "sei_number": "1190.01.0004681/2025-20",
        "description": "CBMMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004666/2025-37",
        "sei_number": "1190.01.0004666/2025-37",
        "description": "TJMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004632/2025-82",
        "sei_number": "1190.01.0004632/2025-82",
        "description": "ALMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004656/2025-16",
        "sei_number": "1190.01.0004656/2025-16",
        "description": "DPMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004669/2025-53",
        "sei_number": "1190.01.0004669/2025-53",
        "description": "TJMMG - TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004336/2025-23",
        "sei_number": "1190.01.0004336/2025-23",
        "description": "TCE - Processo nº 1.144.745 - Exercício 2022 - UO 1191 - Pagamento de encargos financeiros",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004424/2025-72",
        "sei_number": "1190.01.0004424/2025-72",
        "description": "TCE - Auditoria Operacional - Impactos das Mudanças Climáticas no Estado de Minas Gerais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0003668/2025-17",
        "sei_number": "1190.01.0003668/2025-17",
        "description": "TCE - Representação nº 1104899 - Recomendações quanto à insuficiência dos registros contábeis referentes ao estoque e ao pagamento das férias-prêmio",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2025
    },
    {
        "id": "2070.01.0000367/2025-74",
        "sei_number": "2070.01.0000367/2025-74",
        "description": "FAPEMIG - TCE - Esclarecimentos acerca dos valores recebidos a título de percentual constitucional e da execução dos restos a pagar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0004782/2025-09",
        "sei_number": "1190.01.0004782/2025-09",
        "description": "TCE - Execução orçamentária relativa à Lei Paulo Gustavo LCP 195/2022",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0005010/2025-61",
        "sei_number": "1190.01.0005010/2025-61",
        "description": "TCE - Financiamento das despesas em Ações e Serviços Públicos de Saúde (ASPS) - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0005024/2025-71",
        "sei_number": "1190.01.0005024/2025-71",
        "description": "TCE - Acompanhamento de manifestação da SCAF acerca do QESE.",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2025
    },
    {
        "id": "25.0.000001940-5",
        "sei_number": "25.0.000001940-5",
        "description": "TCE - Férias-Prêmio - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0005967/2025-24",
        "sei_number": "1190.01.0005967/2025-24",
        "description": "TCE - 2025 - Relatório Preliminar - Auditoria Financeira sobre o Saldo da Dívida Ativa do Estado, para o exercício findo em 31 de Dezembro de 2023. Carta de Representação - Dívida Ativa.",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0002628/2025-64",
        "sei_number": "1190.01.0002628/2025-64",
        "description": "TCE - Balanço Geral do Estado - Exercício 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006491/2025-38",
        "sei_number": "1190.01.0006491/2025-38",
        "description": "SECOM - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006510/2025-10",
        "sei_number": "1190.01.0006510/2025-10",
        "description": "SEDE - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006511/2025-80",
        "sei_number": "1190.01.0006511/2025-80",
        "description": "SEE - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006512/2025-53",
        "sei_number": "1190.01.0006512/2025-53",
        "description": "SEDESE - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006736/2025-19",
        "sei_number": "1190.01.0006736/2025-19",
        "description": "SEGOV - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006746/2025-40",
        "sei_number": "1190.01.0006746/2025-40",
        "description": "FEAM - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006757/2025-34",
        "sei_number": "1190.01.0006757/2025-34",
        "description": "COPREV - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006798/2025-91",
        "sei_number": "1190.01.0006798/2025-91",
        "description": "SEPLAG - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006825/2025-41",
        "sei_number": "1190.01.0006825/2025-41",
        "description": "SRE - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006833/2025-19",
        "sei_number": "1190.01.0006833/2025-19",
        "description": "SCGOV - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006763/2025-66",
        "sei_number": "1190.01.0006763/2025-66",
        "description": "SCAF - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006923/2025-14",
        "sei_number": "1190.01.0006923/2025-14",
        "description": "SCCG - Monitoramento das recomendações e determinações constantes nos Pareceres Prévios 2021 e 2022 - 1º ciclo 2025",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006958/2025-39",
        "sei_number": "1190.01.0006958/2025-39",
        "description": "TCE - Precatórios - Resultados do Grupo de Trabalho",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0006895/2025-91",
        "sei_number": "1190.01.0006895/2025-91",
        "description": "SEF/GAB - Grupo de Trabalho - Benefícios fiscais e renúncias de receitas",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1080.01.0036989/2025-28",
        "sei_number": "1080.01.0036989/2025-28",
        "description": "TCE - Processo nº 1182224 - Monitoramento referente ao Termo de Cooperação Técnica e Financeira nº 248/2024 - Auditoria Operacional nº 1119965",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Monitoramento",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0007170/2025-38",
        "sei_number": "1190.01.0007170/2025-38",
        "description": "TCE - Educação - Complemento ao SEI 24.0.000008839-7",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0016322/2024-93",
        "sei_number": "1190.01.0016322/2024-93",
        "description": "COPREV - IPSEMG - Monitoramento de apontamentos do TCE-MG na Prestação de Contas do Governador",
        "assigned_to": "evelyne.sousa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1190.01.0006273/2025-07",
        "sei_number": "1190.01.0006273/2025-07",
        "description": "TCE - Relatório que dispõe sobre a conclusão dos estudos do Grupo de Trabalho (GT) da Dívida Ativa, criado por meio da Portaria Conjunta SCAF/SEF, SCCG/SEF, STI/SEF, SUCRED/SEF nº 01, de 18/10/2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0005181/2025-03",
        "sei_number": "1190.01.0005181/2025-03",
        "description": "TCE - Informações detalhadas sobre a utilização de aeronaves oficiais ao longo de 2024",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0005601/2025-12",
        "sei_number": "1190.01.0005601/2025-12",
        "description": "TCE - Relação completa dos convênios celebrados no âmbito do Programa de Apoio ao Desenvolvimento Municipal PADEM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000003784-5",
        "sei_number": "25.0.000003784-5",
        "description": "TCE - Regimes Especiais de Tributação e Benefícios Fiscais",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "25.0.000004360-8",
        "sei_number": "25.0.000004360-8",
        "description": "TCE - Acordo de Repactuação do TTAC de Mariana",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "3040.01.0004043/2025-53",
        "sei_number": "3040.01.0004043/2025-53",
        "description": "COFIN - Apreciação das demonstrações financeiras de 2024 da Empresa de Assistência Técnica e Extensão Rural do Estado de Minas Gerais - EMATER",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0008471/2025-25",
        "sei_number": "1190.01.0008471/2025-25",
        "description": "TCE - Dívida Ativa - Resultados do Grupo de Trabalho",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2025
    },
    {
        "id": "1630.01.0001393/2025-29",
        "sei_number": "1630.01.0001393/2025-29",
        "description": "TCE - Representação nº 1.167.055 - Aplicação dos recursos do Fundo de Erradicação da Miséria - FEM",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2025
    },
    {
        "id": "25.0.000005600-9",
        "sei_number": "25.0.000005600-9",
        "description": "TCE - Balanço Geral do Estado - Exercício de 2024 - Relatório Técnico Preliminar",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-09-01",
        "status": "Acompanhamento especial",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "25.0.000006648-9",
        "sei_number": "25.0.000006648-9",
        "description": "TCE - Execução de emendas parlamentares",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-07-16",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2025
    },
    {
        "id": "1190.01.0008603/2025-50",
        "sei_number": "1190.01.0008603/2025-50",
        "description": "Certificação de RPP, RPNP, Retenções/Consignações e DDO",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-12-31",
        "status": "Acompanhamento especial",
        "type": "Monitoramento",
        "ref_year": 2025
    },
    {
        "id": "1630.01.0001450/2025-42",
        "sei_number": "1630.01.0001450/2025-42",
        "description": "TCE - Monitoramento nº 1.147.778 - Termo de Compromisso Único - ASPS e MDE - Restos a Pagar Processados e Restos a Pagar Não Processados",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-06-16",
        "status": "Finalizado com Desdobramentos",
        "type": "Monitoramento",
        "ref_year": 2020
    },
    {
        "id": "25.0.000008953-5",
        "sei_number": "25.0.000008953-5",
        "description": "TCE - Relatório Temático nº 26/2025 - Receita e Despesa Fiscal - 2º bimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-10-03",
        "status": "Aguarda resposta",
        "type": "Relatório Temático",
        "ref_year": 2025
    },
    {
        "id": "25.0.000008951-9",
        "sei_number": "25.0.000008951-9",
        "description": "TCE - Relatório Temático nº 25/2025 - Execução da LOA - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-10-03",
        "status": "Aguarda resposta",
        "type": "Relatório Temático",
        "ref_year": 2025
    },
    {
        "id": "25.0.000008954-3",
        "sei_number": "25.0.000008954-3",
        "description": "TCE - Relatório Temático nº 27/2025 - ASPS - Ações e Serviços Públicos de Saúde e Termo de Acordo Saúde - 1º quadrimestre",
        "assigned_to": "evelyne.sousa",
        "deadline": "2025-10-03",
        "status": "Aguarda resposta",
        "type": "Relatório Temático",
        "ref_year": 2025
    }
];

const MOCK_PROCESSES = RAW_DATA.map(item => ({
    ...item,
    "sei": item.sei_number,
    "descricao": item.description,
    "ano_referencia": item.ref_year,
    "dt_fim_prevista": item.deadline,
    "tipo": item.type,
    "atribuido": item.assigned_to
}));

async function parseBody(request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) return await request.json();
        const formData = await request.formData();
        const body = {};
        for (const [key, value] of formData.entries()) {
            body[key] = body[key] ? (Array.isArray(body[key]) ? [...body[key], value] : [body[key], value]) : value;
        }
        return body;
    } catch { return {}; }
}

export async function POST(request) {
    await new Promise(r => setTimeout(r, 400));
    const rawBody = await parseBody(request);
    
    const toArray = (v) => v ? (Array.isArray(v) ? v : [v]) : [];
    const filtros = {
        anos: toArray(rawBody.ano_referencia || rawBody.year),
        tipos: toArray(rawBody.tipo || rawBody.type),
        status: toArray(rawBody.status),
        atribuido: toArray(rawBody.atribuido || rawBody.assignedTo),
        dt_inicio: rawBody.data_inicio || rawBody?.dateRange?.from,
        dt_fim: rawBody.data_fim || rawBody?.dateRange?.to
    };

    const filtered = MOCK_PROCESSES.filter(p => {
        if (filtros.anos.length && !filtros.anos.map(String).includes(String(p.ref_year))) return false;
        if (filtros.tipos.length && !filtros.tipos.includes(p.type)) return false;
        if (filtros.status.length && !filtros.status.includes(p.status)) return false;
        if (filtros.atribuido.length && !filtros.atribuido.includes(p.assigned_to)) return false;

        const d = new Date(p.deadline);
        if (filtros.dt_inicio && d < new Date(filtros.dt_inicio)) return false;
        if (filtros.dt_fim && d > new Date(filtros.dt_fim)) return false;
        
        return true;
    });

    return NextResponse.json({
        status: "success",
        total: filtered.length,
        data: filtered
    }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        }
    });
}