import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        "metadata": {
            "ano": "2023",
            "categoria": "Outros",
            "numero_documento": "70835357",
            "ordem": "20230802",
            "processo": "1500010250326202304",
            "tipo": "Solicitacao_TCECFAMGE"
        },
        "sei": {
            "AndamentoGeracao": {
                "Atributos": null,
                "DataHora": "03/08/2023 08:47:10",
                "Descricao": "Registro de documento externo público 70835357 (Correspondência), conferido com documento original",
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
                    "Nome": "Emilly Thais Marques da Silva ",
                    "Sigla": "02323396609"
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
            "Data": "02/08/2023",
            "Descricao": null,
            "DocumentoFormatado": "70835357",
            "IdDocumento": "80599928",
            "IdProcedimento": "80538323",
            "LinkAcesso": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18675381&id_documento=80599928&infra_hash=6a19e58240f5c25a3b5ff37f4959f2b4",
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
                "Nome": "Correspondência"
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
