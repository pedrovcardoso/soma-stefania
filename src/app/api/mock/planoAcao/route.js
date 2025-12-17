import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async loading 

    const data = {
        "plano": {
            "Nome": "Ativo Imobilizado",
            "Status": "Em curso",
            "Resolução": "RESOLUÇÃO CONJUNTA SEF/SEPLAG Nº 5895, DE 26 DE MARÇO DE 2025",
            "Data início": "2025-07-01",
            "Data fim": "2027-01-31",
            "Observações": "Acompanhamento mensal das atividades críticas.",
            "objPessoas": [
                { "Nome": "Marcos Augusto", "Email": "marcos@fazenda.mg.gov.br", "Unidade": "SCCG/ATRI" },
                { "Nome": "Carla Renata", "Email": "", "Unidade": "SCCG" }, // No email, should not be blue
                { "Nome": "Dênis Robson", "Email": "denis@fazenda.mg.gov.br", "Unidade": "SCCG" },
                { "Nome": "Nilson Souza", "Email": "nilson@fazenda.mg.gov.br", "Unidade": "SCCG/DCCG" },
                { "Nome": "Fabiana Januario", "Email": "", "Unidade": "SCCG/DCGS" },
                { "Nome": "Tadeu Lage", "Email": "tadeu@fazenda.mg.gov.br", "Unidade": "SCCG/DCGS" },
                { "Nome": "Danielle Ferrari", "Email": "danielle@fazenda.mg.gov.br", "Unidade": "SCCG/DIEX" }
            ],
            "ID": "17bba3e7-16a8-42e6-90bc-a1e460f95d7b"
        },
        "acoes": [
            {
                "Atividade": "Alteração do SIAD referente à política de depreciação",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2025-09-01",
                "Data fim": "2026-02-28", // Long duration
                "Status": "Em curso"
            },
            {
                "Atividade": "Reavaliação Contábil por Classe",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2025-09-01",
                "Data fim": "2025-10-30",
                "Status": "Concluído"
            },
            {
                "Atividade": "Inventário Físico das Unidades",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2025-11-01",
                "Data fim": "2026-03-30",
                "Status": "Em curso"
            },
            {
                "Atividade": "Treinamento das equipes regionais sobre novos procedimentos de baixa",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2026-01-15",
                "Data fim": "2026-04-15",
                "Status": "Planejado"
            },
            {
                "Atividade": "Validação dos Saldos Iniciais",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2025-08-01",
                "Data fim": "2025-09-15",
                "Status": "Concluído"
            },
            {
                "Atividade": "Integração com Sistema de Patrimônio",
                "Plano de ação": "Ativo Imobilizado",
                "Data de início": "2025-12-01",
                "Data fim": "2026-04-01",
                "Status": "Em curso"
            }
        ]
    };

    return NextResponse.json(data);
}
