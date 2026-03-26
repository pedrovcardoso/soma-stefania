import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const RAW_DATA = [
    {
        "id": "1452.01.0384752/2024-12",
        "sei_number": "1452.01.0384752/2024-12",
        "description": "Relatório de acompanhamento de gestão fiscal referente ao primeiro quadrimestre do exercício vigente.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1738.01.0948372/2024-55",
        "sei_number": "1738.01.0948372/2024-55",
        "description": "Auditoria contábil e financeira nos contratos de prestação de serviço contínuo de manutenção.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1849.01.0029384/2024-34",
        "sei_number": "1849.01.0029384/2024-34",
        "description": "Análise técnica sobre o cumprimento do piso constitucional e repasses para a educação básica.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1122.01.0394857/2024-88",
        "sei_number": "1122.01.0394857/2024-88",
        "description": "Processo de verificação de regularidade das despesas com saúde pública e saneamento.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "2193.01.0038475/2022-19",
        "sei_number": "2193.01.0038475/2022-19",
        "description": "Solicitação de diligência para apuração de denúncia sobre licitação de aquisição de insumos.",
        "assigned_to": "renato.souza",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2022
    },
    {
        "id": "1394.01.0093847/2024-41",
        "sei_number": "1394.01.0093847/2024-41",
        "description": "Avaliação dos restos a pagar e impacto na liquidez do ente governamental no longo prazo.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1503.01.0048573/2024-76",
        "sei_number": "1503.01.0048573/2024-76",
        "description": "Parecer preliminar sobre as contas anuais do exercício financeiro anterior e demonstrações de fluxo de caixa.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1284.01.0039485/2024-90",
        "sei_number": "1284.01.0039485/2024-90",
        "description": "Revisão de aposentadorias e pensões concedidas no último bimestre pelo instituto de previdência.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1675.01.0019283/2024-11",
        "sei_number": "1675.01.0019283/2024-11",
        "description": "Levantamento de dados para composição do Balanço Geral do Estado e notas explicativas.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1482.01.0058473/2024-63",
        "sei_number": "1482.01.0058473/2024-63",
        "description": "Acompanhamento das metas de arrecadação e análise do impacto da renúncia fiscal aprovada.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1193.01.0049586/2024-22",
        "sei_number": "1193.01.0049586/2024-22",
        "description": "Verificação de repasses de convênios federais para obras de infraestrutura rodoviária.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1684.01.0038475/2024-44",
        "sei_number": "1684.01.0038475/2024-44",
        "description": "Levantamento de conformidade referente aos processos de dispensa de licitação emergenciais.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Inspeção Ordinária",
        "ref_year": 2024
    },
    {
        "id": "1938.01.0029384/2024-55",
        "sei_number": "1938.01.0029384/2024-55",
        "description": "Relatório de consolidação de dados patrimoniais e depreciação de bens móveis do estado.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Inspeção Ordinária",
        "ref_year": 2024
    },
    {
        "id": "1583.01.0048576/2022-77",
        "sei_number": "1583.01.0048576/2022-77",
        "description": "Representação originada por denúncia anônima acerca de contratação irregular de consultoria.",
        "assigned_to": "beatriz.costa",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2022
    },
    {
        "id": "1492.01.0038475/2024-88",
        "sei_number": "1492.01.0038475/2024-88",
        "description": "Auditoria de desempenho sobre as políticas públicas voltadas para o setor habitacional.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1739.01.0028374/2024-99",
        "sei_number": "1739.01.0028374/2024-99",
        "description": "Análise de índices de liquidez e solvência dos fundos previdenciários estaduais.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1283.01.0049586/2024-11",
        "sei_number": "1283.01.0049586/2024-11",
        "description": "Solicitação de notas fiscais e comprovantes de prestação de serviços terceirizados.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1654.01.0038475/2024-22",
        "sei_number": "1654.01.0038475/2024-22",
        "description": "Estudo de viabilidade técnica e financeira para concessão de parques estaduais.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1928.01.0048576/2024-33",
        "sei_number": "1928.01.0048576/2024-33",
        "description": "Verificação de saldo de emendas parlamentares não executadas no período fiscal anterior.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1485.01.0039485/2024-44",
        "sei_number": "1485.01.0039485/2024-44",
        "description": "Relatório sobre a evolução da dívida fundada e limites de endividamento do executivo.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1734.01.0028374/2024-55",
        "sei_number": "1734.01.0028374/2024-55",
        "description": "Apuração de irregularidades em convênios celebrados com Organizações da Sociedade Civil.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1293.01.0049586/2024-66",
        "sei_number": "1293.01.0049586/2024-66",
        "description": "Inspeção para avaliação da estrutura de controles internos nas aquisições de tecnologia.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1584.01.0038475/2024-77",
        "sei_number": "1584.01.0038475/2024-77",
        "description": "Revisão dos cálculos atuariais e das premissas econômicas do plano de pensão.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1847.01.0048576/2024-88",
        "sei_number": "1847.01.0048576/2024-88",
        "description": "Investigação sobre a suposta falta de repasse aos municípios do fundo de participação.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1395.01.0029384/2024-99",
        "sei_number": "1395.01.0029384/2024-99",
        "description": "Avaliação do grau de transparência ativa nos portais governamentais e atendimento à LAI.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1648.01.0038475/2024-12",
        "sei_number": "1648.01.0038475/2024-12",
        "description": "Exame das demonstrações financeiras consolidadas das empresas estatais dependentes.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1923.01.0049586/2024-23",
        "sei_number": "1923.01.0049586/2024-23",
        "description": "Readequação do quadro de detalhamento de despesas para atendimento de calamidade pública.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1486.01.0038475/2024-34",
        "sei_number": "1486.01.0038475/2024-34",
        "description": "Análise da viabilidade do acordo de parcelamento de dívidas tributárias de grandes devedores.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1759.01.0028374/2024-45",
        "sei_number": "1759.01.0028374/2024-45",
        "description": "Monitoramento das recomendações exaradas pelo tribunal em exercícios financeiros anteriores.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1396.01.0048576/2024-56",
        "sei_number": "1396.01.0048576/2024-56",
        "description": "Diligência para esclarecimento sobre o acréscimo de aditivos contratuais acima do limite legal.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1827.01.0039485/2024-67",
        "sei_number": "1827.01.0039485/2024-67",
        "description": "Verificação do registro contábil de precatórios e requisições de pequeno valor expedidas.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1493.01.0028374/2024-78",
        "sei_number": "1493.01.0028374/2024-78",
        "description": "Avaliação dos custos operacionais envolvidos na gestão das frotas de veículos oficiais.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "1638.01.0049586/2024-89",
        "sei_number": "1638.01.0049586/2024-89",
        "description": "Estudo comparativo das alíquotas de ICMS aplicadas em operações interestaduais e seus impactos.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1729.01.0038475/2024-90",
        "sei_number": "1729.01.0038475/2024-90",
        "description": "Análise da correta aplicação dos recursos do fundo de amparo ao trabalhador.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1384.01.0029384/2024-12",
        "sei_number": "1384.01.0029384/2024-12",
        "description": "Fiscalização orientativa sobre processos de contratação de parcerias público-privadas.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1948.01.0048576/2024-23",
        "sei_number": "1948.01.0048576/2024-23",
        "description": "Levantamento estatístico das despesas com diárias e passagens aéreas no poder executivo.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1586.01.0039485/2024-34",
        "sei_number": "1586.01.0039485/2024-34",
        "description": "Revisão dos lançamentos contábeis de ajuste patrimonial no fechamento do quadrimestre.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1837.01.0028374/2024-45",
        "sei_number": "1837.01.0028374/2024-45",
        "description": "Parecer conclusivo sobre a execução orçamentária dos fundos de defesa civil e calamidade.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1495.01.0049586/2024-56",
        "sei_number": "1495.01.0049586/2024-56",
        "description": "Monitoramento da implementação das normas internacionais de contabilidade no setor público.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1728.01.0038475/2024-67",
        "sei_number": "1728.01.0038475/2024-67",
        "description": "Auditoria de folhas de pagamento para identificar acúmulo ilícito de cargos públicos.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1639.01.0029384/2024-78",
        "sei_number": "1639.01.0029384/2024-78",
        "description": "Acompanhamento da compensação financeira pela exploração de recursos hídricos e minerais.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1846.01.0048576/2024-89",
        "sei_number": "1846.01.0048576/2024-89",
        "description": "Análise técnica do impacto da concessão de benefícios fiscais no ICMS da energia elétrica.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1397.01.0039485/2024-90",
        "sei_number": "1397.01.0039485/2024-90",
        "description": "Parecer de acompanhamento das medidas saneadoras propostas na última inspeção especial.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1958.01.0028374/2024-12",
        "sei_number": "1958.01.0028374/2024-12",
        "description": "Diligência para esclarecimento dos critérios de seleção em editais de fomento à cultura.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1487.01.0049586/2024-23",
        "sei_number": "1487.01.0049586/2024-23",
        "description": "Avaliação dos gastos com publicidade oficial e atendimento aos princípios da impessoalidade.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1732.01.0038475/2024-34",
        "sei_number": "1732.01.0038475/2024-34",
        "description": "Inspeção ordinária na secretaria de infraestrutura, com foco em licitações de obras paralisadas.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1645.01.0029384/2024-45",
        "sei_number": "1645.01.0029384/2024-45",
        "description": "Revisão dos fluxos de trabalho e conformidade do setor de pagamentos de fornecedores.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1856.01.0048576/2024-56",
        "sei_number": "1856.01.0048576/2024-56",
        "description": "Apurar suposto sobrepreço na aquisição de equipamentos de proteção individual.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1398.01.0039485/2024-67",
        "sei_number": "1398.01.0039485/2024-67",
        "description": "Auditoria no sistema informatizado de controle de estoque de medicamentos de alto custo.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1925.01.0028374/2024-78",
        "sei_number": "1925.01.0028374/2024-78",
        "description": "Levantamento de contingências passivas e provisionamento de riscos judiciais.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1488.01.0049586/2024-89",
        "sei_number": "1488.01.0049586/2024-89",
        "description": "Análise da composição tarifária de pedágios nas rodovias concedidas ao setor privado.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1743.01.0038475/2024-90",
        "sei_number": "1743.01.0038475/2024-90",
        "description": "Verificar a regularidade da execução orçamentária vinculada aos royalties do petróleo.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1656.01.0029384/2024-12",
        "sei_number": "1656.01.0029384/2024-12",
        "description": "Auditoria focada nas despesas de manutenção da frota de aeronaves governamentais.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1838.01.0048576/2024-23",
        "sei_number": "1838.01.0048576/2024-23",
        "description": "Avaliação do grau de endividamento dos municípios jurisdicionados em relação à LRF.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1399.01.0039485/2024-34",
        "sei_number": "1399.01.0039485/2024-34",
        "description": "Acompanhamento e suporte técnico à comissão de transição de governo municipal.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1945.01.0028374/2024-45",
        "sei_number": "1945.01.0028374/2024-45",
        "description": "Diligência junto ao DETRAN para apuração de divergências nas taxas de licenciamento.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1489.01.0049586/2024-56",
        "sei_number": "1489.01.0049586/2024-56",
        "description": "Estudo e modelagem para avaliação de reajuste nos contratos de vigilância armada.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1735.01.0038475/2024-67",
        "sei_number": "1735.01.0038475/2024-67",
        "description": "Revisão dos critérios para concessão de adicional de insalubridade e periculosidade.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1647.01.0029384/2024-78",
        "sei_number": "1647.01.0029384/2024-78",
        "description": "Apuração de eventuais inconsistências nos registros do sistema contábil estadual (SIAFI).",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1858.01.0048576/2024-89",
        "sei_number": "1858.01.0048576/2024-89",
        "description": "Avaliação de impacto econômico-financeiro da redução de jornada para servidores de saúde.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1385.01.0039485/2024-90",
        "sei_number": "1385.01.0039485/2024-90",
        "description": "Auditoria para mapeamento e gestão de risco em contratos de TI de grande materialidade.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1954.01.0028374/2024-12",
        "sei_number": "1954.01.0028374/2024-12",
        "description": "Análise contábil dos adiantamentos concedidos a servidores e pendentes de prestação de contas.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "1490.01.0049586/2024-23",
        "sei_number": "1490.01.0049586/2024-23",
        "description": "Acompanhamento da elaboração da Lei de Diretrizes Orçamentárias para o próximo exercício.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1746.01.0038475/2024-34",
        "sei_number": "1746.01.0038475/2024-34",
        "description": "Auditoria de folhas de pagamento na Secretaria da Educação visando coibir duplo vínculo.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1658.01.0029384/2024-45",
        "sei_number": "1658.01.0029384/2024-45",
        "description": "Fiscalização do uso dos recursos vinculados ao Fundo de Manutenção e Desenvolvimento do Ensino.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Relatório Temático",
        "ref_year": 2024
    },
    {
        "id": "1839.01.0048576/2024-56",
        "sei_number": "1839.01.0048576/2024-56",
        "description": "Parecer prévio sobre a inexigibilidade de licitação para contratação de show artístico.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1386.01.0039485/2024-67",
        "sei_number": "1386.01.0039485/2024-67",
        "description": "Levantamento de pendências no sistema de convênios para liberação de parcelas subsequentes.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1946.01.0028374/2024-78",
        "sei_number": "1946.01.0028374/2024-78",
        "description": "Análise da conformidade legal na alienação de imóveis públicos e desafetações recentes.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1491.01.0049586/2024-89",
        "sei_number": "1491.01.0049586/2024-89",
        "description": "Averiguação de possíveis desvios de finalidade na utilização da frota estadual.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Denúncia",
        "ref_year": 2024
    },
    {
        "id": "1752.01.0038475/2024-90",
        "sei_number": "1752.01.0038475/2024-90",
        "description": "Avaliação do controle de almoxarifado central e sistema de distribuição de suprimentos.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1663.01.0029384/2024-12",
        "sei_number": "1663.01.0029384/2024-12",
        "description": "Revisão dos repasses de ICMS Ecológico para os municípios habilitados no sistema ambiental.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1840.01.0048576/2024-23",
        "sei_number": "1840.01.0048576/2024-23",
        "description": "Diligência a respeito da correta retenção e recolhimento de contribuições previdenciárias patronais.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Representação",
        "ref_year": 2024
    },
    {
        "id": "1387.01.0039485/2024-34",
        "sei_number": "1387.01.0039485/2024-34",
        "description": "Solicitação de justificativa técnica para aquisição de softwares sem estudo de alternativas.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1947.01.0028374/2024-45",
        "sei_number": "1947.01.0028374/2024-45",
        "description": "Apuração dos índices mínimos constitucionais em saúde e MDE no fechamento do ano fiscal.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1492.01.0049586/2024-56",
        "sei_number": "1492.01.0049586/2024-56",
        "description": "Análise sobre repactuação e reequilíbrio econômico-financeiro de obras de pavimentação.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1753.01.0038475/2024-67",
        "sei_number": "1753.01.0038475/2024-67",
        "description": "Revisão do estoque da dívida e acompanhamento do Regime de Recuperação Fiscal.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1664.01.0029384/2024-78",
        "sei_number": "1664.01.0029384/2024-78",
        "description": "Verificação de saldos em contas bancárias inativas vinculadas a programas extintos.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1841.01.0048576/2024-89",
        "sei_number": "1841.01.0048576/2024-89",
        "description": "Análise da correta aplicação do teto remuneratório constitucional em autarquias estaduais.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1388.01.0039485/2024-90",
        "sei_number": "1388.01.0039485/2024-90",
        "description": "Auditoria nas concessões de diárias e passagens para identificar possíveis excessos ou falhas.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1948.01.0028374/2024-12",
        "sei_number": "1948.01.0028374/2024-12",
        "description": "Avaliação dos impactos previdenciários das recentes reformas aprovadas no legislativo local.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1493.01.0049586/2024-23",
        "sei_number": "1493.01.0049586/2024-23",
        "description": "Levantamento estatístico das demandas judiciais cíveis e trabalhistas com trânsito em julgado.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Outros",
        "ref_year": 2024
    },
    {
        "id": "84.3.000008475-1",
        "sei_number": "84.3.000008475-1",
        "description": "Análise do cumprimento das metas físicas de vacinação em relação aos fundos recebidos.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "74.8.000004958-3",
        "sei_number": "74.8.000004958-3",
        "description": "Apuração dos pagamentos de exercícios anteriores reconhecidos sem previsão na LOA.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1754.01.0038475/2024-34",
        "sei_number": "1754.01.0038475/2024-34",
        "description": "Relatório analítico sobre as Parcerias de Desenvolvimento Produtivo (PDP) na área da saúde.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1665.01.0029384/2024-45",
        "sei_number": "1665.01.0029384/2024-45",
        "description": "Exame das provisões para devedores duvidosos registradas nas autarquias da administração indireta.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "84.5.000002938-2",
        "sei_number": "84.5.000002938-2",
        "description": "Fiscalização in loco das obras do anel viário metropolitano para atestar liquidações de despesas.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1842.01.0048576/2022-56",
        "sei_number": "1842.01.0048576/2022-56",
        "description": "Elaboração de notas explicativas adicionais para composição do balanço de encerramento.",
        "assigned_to": "ana.julia",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2022
    },
    {
        "id": "1389.01.0039485/2024-67",
        "sei_number": "1389.01.0039485/2024-67",
        "description": "Auditoria de sistemas para validar a fidedignidade dos dados reportados no portal da transparência.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "76.4.000008475-9",
        "sei_number": "76.4.000008475-9",
        "description": "Estudo e mapeamento de riscos para implementação de novo sistema integrado de finanças públicas.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1949.01.0028374/2024-78",
        "sei_number": "1949.01.0028374/2024-78",
        "description": "Parecer prévio sobre projeto de lei que autoriza permuta de terrenos da administração direta.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Auditoria",
        "ref_year": 2024
    },
    {
        "id": "1494.01.0049586/2024-89",
        "sei_number": "1494.01.0049586/2024-89",
        "description": "Análise da prestação de contas dos recursos transferidos por meio de convênios federais voluntários.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1755.01.0038475/2024-90",
        "sei_number": "1755.01.0038475/2024-90",
        "description": "Apurar eventuais inconsistências na conciliação bancária das contas de livre movimentação do estado.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1666.01.0029384/2024-12",
        "sei_number": "1666.01.0029384/2024-12",
        "description": "Exame das demonstrações do fluxo de caixa e mutações do patrimônio líquido da fundação de cultura.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1843.01.0048576/2024-23",
        "sei_number": "1843.01.0048576/2024-23",
        "description": "Relatório circunstanciado sobre falhas no recolhimento e repasse de imposto de renda retido na fonte.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1390.01.0039485/2024-34",
        "sei_number": "1390.01.0039485/2024-34",
        "description": "Levantamento de divergências na apuração do superávit financeiro do exercício de 2023.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1950.01.0028374/2024-45",
        "sei_number": "1950.01.0028374/2024-45",
        "description": "Acompanhamento da desestatização de empresa pública controlada diretamente pelo estado.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1495.01.0049586/2024-56",
        "sei_number": "1495.01.0049586/2024-56",
        "description": "Auditoria no processo de compras e dispensas emergenciais da Secretaria Estadual de Saúde.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1756.01.0038475/2024-67",
        "sei_number": "1756.01.0038475/2024-67",
        "description": "Verificação das garantias, fianças e avais prestados pelo ente federativo em operações de crédito.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1667.01.0029384/2024-78",
        "sei_number": "1667.01.0029384/2024-78",
        "description": "Análise contábil dos restos a pagar inscritos no exercício encerrado visando conformidade legal.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1844.01.0048576/2024-89",
        "sei_number": "1844.01.0048576/2024-89",
        "description": "Parecer conclusivo sobre a tomada de contas especial decorrente de suposto dano ao erário.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1391.01.0039485/2024-90",
        "sei_number": "1391.01.0039485/2024-90",
        "description": "Avaliação atuarial anual de equilíbrio financeiro do regime próprio de previdência social.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1951.01.0028374/2024-12",
        "sei_number": "1951.01.0028374/2024-12",
        "description": "Apurar recebimento indevido de benefícios sociais acumulados com remuneração de cargos públicos.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1496.01.0049586/2024-23",
        "sei_number": "1496.01.0049586/2024-23",
        "description": "Revisão dos convênios de cooperação técnica internacional celebrados para inovação tecnológica.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1757.01.0038475/2024-34",
        "sei_number": "1757.01.0038475/2024-34",
        "description": "Levantamento das variações patrimoniais aumentativas e diminutivas do exercício e seus impactos.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1668.01.0029384/2024-45",
        "sei_number": "1668.01.0029384/2024-45",
        "description": "Análise das metas fiscais alcançadas conforme parâmetros do Plano Plurianual e LDO.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1845.01.0048576/2024-56",
        "sei_number": "1845.01.0048576/2024-56",
        "description": "Acompanhamento e correção de ressalvas apontadas em acórdãos emitidos no último exercício.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1392.01.0039485/2024-67",
        "sei_number": "1392.01.0039485/2024-67",
        "description": "Verificação do cálculo dos repasses constitucionais aos poderes legislativo, judiciário e MP.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "87.3.000004958-4",
        "sei_number": "87.3.000004958-4",
        "description": "Estudo comparativo da evolução da folha de pagamento face à Receita Corrente Líquida.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "89.5.000002938-5",
        "sei_number": "89.5.000002938-5",
        "description": "Solicitação de informações de regularidade previdenciária e emissão do respectivo certificado (CRP).",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1758.01.0038475/2024-78",
        "sei_number": "1758.01.0038475/2024-78",
        "description": "Diligências para sanar dúvidas referentes à conciliação das contas bancárias centralizadoras do tesouro.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "1669.01.0029384/2024-89",
        "sei_number": "1669.01.0029384/2024-89",
        "description": "Apuração de conformidade na contabilização dos recursos provenientes de leilões e alienações.",
        "assigned_to": "marcos.silva",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "85.2.000004857-6",
        "sei_number": "85.2.000004857-6",
        "description": "Acompanhamento trimestral das despesas de custeio administrativo e possíveis reduções.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1393.01.0039485/2024-90",
        "sei_number": "1393.01.0039485/2024-90",
        "description": "Nota técnica versando sobre a sistemática de compensação de saldos credores de ICMS.",
        "assigned_to": "carlos.eduardo",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2024
    },
    {
        "id": "88.6.000002837-7",
        "sei_number": "88.6.000002837-7",
        "description": "Análise conclusiva referente ao uso do Regime Especial Tributário para incentivo ao desenvolvimento.",
        "assigned_to": "beatriz.costa",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
    },
    {
        "id": "1953.01.0049586/2024-12",
        "sei_number": "1953.01.0049586/2024-12",
        "description": "Investigação preliminar de irregularidades relatadas em obras de contenção de encostas.",
        "assigned_to": "renato.souza",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Acompanhamento",
        "ref_year": 2024
    },
    {
        "id": "1498.01.0038475/2022-23",
        "sei_number": "1498.01.0038475/2022-23",
        "description": "Emissão de parecer prévio relativo às contas governamentais consolidadas do último ano fiscal.",
        "assigned_to": "marcos.silva",
        "deadline": "2022-01-01",
        "status": "Finalizado e Concluído",
        "type": "Balanço Geral do Estado",
        "ref_year": 2022
    },
    {
        "id": "93.4.000004958-8",
        "sei_number": "93.4.000004958-8",
        "description": "Avaliação atuarial e impacto das recentes normativas do Regime de Recuperação Fiscal e dívida.",
        "assigned_to": "ana.julia",
        "deadline": "2024-01-01",
        "status": "Finalizado e Concluído",
        "type": "Solicitação TCE/CFAMGE",
        "ref_year": 2024
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