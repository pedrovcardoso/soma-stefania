import { NextResponse } from 'next/server';

export async function POST(request) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    const protocolo = params.get('protocolo');

    await new Promise(resolve => setTimeout(resolve, 800));

    const documentosMap = {
        "60660864": { tipo: "Portaria", data: "09/08/2022", ext: "pdf" },
        "52683756": { tipo: "Relatorio.xlsx", data: "30/11/2021", ext: "xlsx" },
        "52683779": { tipo: "Relatorio 2.csv", data: "30/11/2021", ext: "xlsx" },
        "52443478": { tipo: "Minuta de resposta", data: "01/09/2022", ext: "docx" },
        "52443425": { tipo: "Anexos Diversos.zip", data: "01/09/2022", ext: "zip" },
        "52443481": { tipo: "Email de aprovação", data: "01/09/2022", ext: "pdf" },
        "52443483": { tipo: "NF-E", data: "01/09/2022", ext: "png" }
    };

    const docInfo = documentosMap[protocolo] || { tipo: "Documento Generico", data: "01/01/2023", ext: "pdf" };

    return NextResponse.json({
        "metadata": {
            "ano": docInfo.data.split('/')[2],
            "categoria": "Outros",
            "numero_documento": protocolo || "70835357",
            "ordem": "20230802",
            "processo": "1500010250326202304",
            "tipo": docInfo.tipo
        },
        "sei": {
            "AndamentoGeracao": {
                "Atributos": null,
                "DataHora": `${docInfo.data} 08:47:10`,
                "Descricao": `Registro de documento externo público ${protocolo} (${docInfo.tipo}), conferido com documento original`,
                "IdAndamento": null,
                "IdTarefa": null,
                "IdTarefaModulo": null,
                "Unidade": {
                    "Descricao": "Ilha Central de Digitalização Cidade Administrativa - SEI",
                    "IdUnidade": "110001092",
                    "Sigla": "SEPLAG/ICD",
                    "SinArquivamento": null,
                    "SinOuvidoria": null,
                    "SinProtocolo": null
                },
                "Usuario": {
                    "IdUsuario": "100368660",
                    "Nome": "Analista de Testes",
                    "Sigla": "TESTE"
                }
            },
            "Assinaturas": [
                {
                    "CargoFuncao": "Servidor(a) Público(a)",
                    "DataHora": "03/08/2023 09:03:20",
                    "IdOrgao": "28",
                    "IdOrigem": null,
                    "IdUsuario": "100003807",
                    "Nome": "Aristóteles Santos Pinheiro",
                    "Sigla": "08238683629"
                },
                {
                    "CargoFuncao": "Servidor(a) Público(a)",
                    "DataHora": "03/08/2023 09:03:20",
                    "IdOrgao": "28",
                    "IdOrigem": null,
                    "IdUsuario": "100003807",
                    "Nome": "Aristóteles Santos Pinheiro",
                    "Sigla": "08238683629"
                },
                {
                    "CargoFuncao": "Servidor(a) Público(a)",
                    "DataHora": "03/08/2023 09:03:20",
                    "IdOrgao": "28",
                    "IdOrigem": null,
                    "IdUsuario": "100003807",
                    "Nome": "Aristóteles Santos Pinheiro",
                    "Sigla": "08238683629"
                },
                {
                    "CargoFuncao": "Servidor(a) Público(a)",
                    "DataHora": "03/08/2023 09:03:20",
                    "IdOrgao": "28",
                    "IdOrigem": null,
                    "IdUsuario": "100003807",
                    "Nome": "Aristóteles Santos Pinheiro",
                    "Sigla": "08238683629"
                }
            ],
            "Campos": [],
            "Data": docInfo.data,
            "Descricao": null,
            "DocumentoFormatado": protocolo || "70835357",
            "IdDocumento": "80599928",
            "IdProcedimento": "80538323",
            "LinkAcesso": `/mock/listaDocumentos/sample.${docInfo.ext}`,
            "NivelAcessoGlobal": "1",
            "NivelAcessoLocal": "0",
            "NomeArvore": "ENV.DESTINATARIO REMETENTE",
            "Numero": null,
            "ProcedimentoFormatado": "1500.01.0250326/2023-04",
            "Publicacao": {
                "DataDisponibilizacao": null,
                "DataPublicacao": null,
                "Estado": null,
                "IdDocumento": null,
                "IdPublicacao": null,
                "IdVeiculoPublicacao": null,
                "ImprensaNacional": null,
                "NomeVeiculo": null,
                "Numero": null,
                "Resumo": null,
                "StaMotivo": null,
                "StaTipoVeiculo": null
            },
            "Serie": {
                "Aplicabilidade": null,
                "IdSerie": "38",
                "Nome": docInfo.tipo
            },
            "UnidadeElaboradora": {
                "Descricao": "Ilha Central de Digitalização Cidade Administrativa - SEI",
                "IdUnidade": "110001092",
                "Sigla": "SEPLAG/ICD",
                "SinArquivamento": null,
                "SinOuvidoria": null,
                "SinProtocolo": null
            }
        },
        "status": "success"
    });
}
