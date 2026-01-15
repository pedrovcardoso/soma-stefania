
import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const body = await request.json();
    const { prompt, filtros } = body;

    const mockResponse = {
        resposta: `Esta é uma resposta simulada da StefanIA para a pergunta: "${prompt}". \n\nCom base no processo ${filtros?.processo || 'selecionado'} e categoria ${filtros?.categoria || 'geral'}, a análise indica conformidade nos pontos x, y e z.`,
        documentos_utilizados: [
            "76324260",
            "87986762"
        ],
        processos_encontrados: [
            filtros?.processo || "123153"
        ]
    };

    return NextResponse.json(mockResponse);
}
