import { NextResponse } from 'next/server';

// Matches /detalheProcesso response schema
// properties:
//   processo: $ref: "#/components/schemas/ProcessoDetalhado"
//   tags: array of $ref: "#/components/schemas/Tag"
//   sei: object

export async function POST(request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Get 'sei' from body to potentially return dynamic ID
        const body = await request.json().catch(() => ({}));
        const reqSei = body.sei || "1234.56789/2025-11";

        return NextResponse.json({
            processo: {
                sei: reqSei,
                ano_referencia: "2025",
                tipo: "Licitação",
                descricao: "Processo administrativo referente à aquisição de equipamentos de TI para a nova sede da SEF/MG.",
                status: "Em Análise",
                atribuido: "Pedro Cardoso",
                dt_recebimento: "10/01/2025",
                dt_fim_prevista: "15/02/2025",
                dt_dilacao: "01/02/2025",
                sei_dilacao: "9876.54321/2025-01",
                dt_resposta: "20/01/2025",
                obs: "Aguardando parecer jurídico sobre minuta do edital. Prioridade alta definida pelo gabinete."
            },
            tags: [
                { id_tag: 1, tag: "TI" },
                { id_tag: 2, tag: "Compras" },
                { id_tag: 3, tag: "Urgente" }
            ],
            sei: {
                id_procedimento: 12345,
                link: "https://sei.mg.gov.br/sei/controlador.php?acao=procedimento_trabalhar&id_procedimento=12345"
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch mock data' }, { status: 500 });
    }
}
