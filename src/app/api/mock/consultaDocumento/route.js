import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
        ok: true,
        sei: {
            url_conteudo: "#",
            protocolo: "123456"
        },
        metadata: {
            processo: "1234.56789/2025-11",
            numero_documento: "123456",
            tipo: "Edital",
            categoria: "Licitacao",
            ordem: "1",
            ano: "2025"
        }
    });
}
