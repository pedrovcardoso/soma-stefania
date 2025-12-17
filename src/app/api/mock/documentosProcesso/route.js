import { NextResponse } from 'next/server';

// Matches /documentosProcesso response schema
// properties:
//   documentos: array of $ref: "#/components/schemas/Documento"
// Documento properties: nome, url, tipo, data, unidade, existe_azure, processo_origem

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 400));

    return NextResponse.json({
        documentos: [
            {
                nome: "Edital_001_2025.pdf",
                url: "#",
                tipo: "Edital",
                data: "10/01/2025",
                unidade: "DTI",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Parecer_Juridico.pdf",
                url: "#",
                tipo: "Parecer",
                data: "12/01/2025",
                unidade: "AJ",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Minuta_Contrato.docx",
                url: "#",
                tipo: "Minuta",
                data: "14/01/2025",
                unidade: "DTI",
                existe_azure: "nao",
                processo_origem: "1234.56789/2025-11"
            }
        ]
    });
}
