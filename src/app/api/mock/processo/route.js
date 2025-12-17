import { NextResponse } from 'next/server';

// Matches /processo response schema
// properties:
//   status: { type: string }
//   data:
//     type: array
//     items: $ref: "#/components/schemas/ProcessoResumo"
// ProcessoResumo properties: status, sei, descricao, ano_referencia, dt_fim_prevista, tipo, atribuido

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generating 15 mock items conforming to ProcessoResumo
    const processList = Array.from({ length: 15 }).map((_, i) => ({
        sei: `1234.567${i}/2025-${(i % 12) + 1}`,
        descricao: `Processo de Exemplo ${i + 1} - Aquisição de Licenças de Software e Equipamentos para o projeto SOMA.`,
        atribuido: i % 2 === 0 ? "Pedro Cardoso" : "Ana Silva",
        dt_fim_prevista: new Date(2025, 2, 15 + i).toISOString().split('T')[0], // Mapped from deadline
        status: i % 3 === 0 ? "Em Análise" : i % 3 === 1 ? "Concluído" : "Aguardando Resposta",
        tipo: i % 2 === 0 ? "Licitação" : "Contrato",
        ano_referencia: "2025" // Mapped from ref_year
    }));

    return NextResponse.json({
        status: "success",
        data: processList
    });
}
