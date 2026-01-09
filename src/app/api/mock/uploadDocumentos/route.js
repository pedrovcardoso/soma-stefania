import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
        status: "finalizado",
        resultado: [
            {
                documento: "12345",
                status: "success",
                detalhe: { message: "Upload concluído com sucesso." }
            },
            {
                documento: "67890",
                status: "success",
                detalhe: { message: "Upload concluído com sucesso." }
            }
        ]
    });
}
