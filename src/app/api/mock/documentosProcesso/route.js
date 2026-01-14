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
                nome: "Edital de Licitação.pdf",
                url: "/api/mock/documentosProcesso/sample.pdf",
                tipo: "Edital",
                data: "10/01/2025",
                unidade: "DTI",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Minuta do Contrato.docx",
                url: "/api/mock/documentosProcesso/sample.docx",
                tipo: "Minuta",
                data: "12/01/2025",
                unidade: "AJ",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Planilha Orçamentária.xlsx",
                url: "/api/mock/documentosProcesso/sample.xlsx",
                tipo: "Planilha",
                data: "15/01/2025",
                unidade: "DTI",
                existe_azure: "nao",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Evidência Fotográfica.png",
                url: "/api/mock/documentosProcesso/sample.png",
                tipo: "Anexo",
                data: "16/01/2025",
                unidade: "Vistoria",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Anexos Diversos.zip",
                url: "/api/mock/documentosProcesso/sample.zip",
                tipo: "Arquivo",
                data: "20/01/2025",
                unidade: "DTI",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Vídeo da Vistoria.mp4",
                url: "/api/mock/documentosProcesso/sample.mp4",
                tipo: "Mídia",
                data: "22/01/2025",
                unidade: "Vistoria",
                existe_azure: "nao",
                processo_origem: "1234.56789/2025-11"
            },
            {
                nome: "Email de Aprovação.msg",
                url: "/api/mock/documentosProcesso/sample.msg",
                tipo: "Email",
                data: "28/01/2025",
                unidade: "Chefia",
                existe_azure: "sim",
                processo_origem: "1234.56789/2025-11"
            }
        ]
    });
}
