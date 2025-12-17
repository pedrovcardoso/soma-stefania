import { NextResponse } from 'next/server';

export async function GET(request) {
    return NextResponse.json({
        anos: ["2023", "2024", "2025"],
        tipos: ["Licitação", "Contratação Direta", "Aditivo", "Apostilamento", "Processo Administrativo"],
        status: ["Em elaboração", "Em análise", "Aguardando assinatura", "Concluído", "Arquivado"]
    });
}
