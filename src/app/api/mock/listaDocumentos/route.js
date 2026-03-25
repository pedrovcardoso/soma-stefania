import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
        "documentos": [
            {
                "data": "09/08/2022",
                "documento": "60660864",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Portaria",
                "unidade": "FAPEMIG/PRES",
                "url": "/api/mock/listaDocumentos/sample.pdf"
            },
            {
                "data": "30/11/2021",
                "documento": "52683756",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Relatorio.xlsx",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.xlsx"
            },
            {
                "data": "30/11/2021",
                "documento": "52683779",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Relatorio 2.csv",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.xlsx"
            },
            {
                "data": "01/09/2022",
                "documento": "52443478",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Minuta de resposta",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.docx"
            },
            {
                "data": "01/09/2022",
                "documento": "52443425",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Anexos Diversos.zip",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.zip"
            },
            {
                "data": "01/09/2022",
                "documento": "52443481",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Email de aprovação",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.msg"
            },
            {
                "data": "01/09/2022",
                "documento": "52443483",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "NF-E",
                "unidade": "FAPEMIG/DPGF",
                "url": "/api/mock/listaDocumentos/sample.png"
            }
        ],
        "status": "success",
        "total": 28
    });
}
