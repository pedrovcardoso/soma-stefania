import { NextResponse } from 'next/server';

// Mock data based on real API response format
const mockProcessDetails = {
    "processo": {
        "ano_referencia": 2023,
        "atribuido": "evelyne.sousa",
        "descricao": "TCE - SEDESE - Termo de Acordo do Piso Mineiro de Assistência Social Fixo",
        "dt_dilacao": "Sun, 01 Jan 2023 00:00:00 GMT",
        "dt_fim_prevista": "Sun, 01 Jan 2023 00:00:00 GMT",
        "dt_recebimento": "Sun, 01 Jan 2023 00:00:00 GMT",
        "dt_resposta": "Sun, 01 Jan 2023 00:00:00 GMT",
        "obs": "Carga inicial com base no bloco interno TCE",
        "sei": "1500.01.0250326/2023-04",
        "sei_dilacao": "",
        "status": "Finalizado e Concluído",
        "tipo": "Solicitação TCE/CFAMGE"
    },
    "sei": {
        "__values__": {
            "AndamentoConclusao": {
                "__values__": {
                    "Atributos": null,
                    "DataHora": null,
                    "Descricao": null,
                    "IdAndamento": null,
                    "IdTarefa": null,
                    "IdTarefaModulo": null,
                    "Unidade": null,
                    "Usuario": null
                }
            },
            "AndamentoGeracao": {
                "__values__": {
                    "Atributos": null,
                    "DataHora": "02/08/2023 12:50:26",
                    "Descricao": "Processo público gerado",
                    "IdAndamento": null,
                    "IdTarefa": null,
                    "IdTarefaModulo": null,
                    "Unidade": {
                        "__values__": {
                            "Descricao": "Protocolo Central da Cidade Administrativa",
                            "IdUnidade": "110011999",
                            "Sigla": "SEPLAG/PROGERAIS",
                            "SinArquivamento": null,
                            "SinOuvidoria": null,
                            "SinProtocolo": null
                        }
                    },
                    "Usuario": {
                        "__values__": {
                            "IdUsuario": "100003847",
                            "Nome": "Marisa Rodrigues Santana",
                            "Sigla": "03177103623"
                        }
                    }
                }
            },
            "Assuntos": [
                {
                    "__values__": {
                        "CodigoEstruturado": "911.123",
                        "Descricao": "PROTOCOLO: RECEPÇAO. TRAMITAÇAO E EXPEDIÇAO DE DOCUMENTOS"
                    }
                },
                {
                    "__values__": {
                        "CodigoEstruturado": "999",
                        "Descricao": "EM ELABORAÇÃO"
                    }
                }
            ],
            "DataAutuacao": "02/08/2023",
            "Especificacao": "Solicitação TCE",
            "IdProcedimento": "80538323",
            "Interessados": [
                {
                    "__values__": {
                        "Nome": "TRIBUNAL DE CONTAS",
                        "Sigla": null
                    }
                }
            ],
            "LinkAcesso": "https://www.sei.mg.gov.br/sei/processo_acesso_externo_consulta.php?id_acesso_externo=18675381&infra_hash=5cd42e665786b16cd45ab2dfaec110f3",
            "NivelAcessoGlobal": "1",
            "NivelAcessoLocal": "1",
            "Observacoes": [
                {
                    "__values__": {
                        "Descricao": "bn012446387br",
                        "Unidade": {
                            "__values__": {
                                "Descricao": "Protocolo Central da Cidade Administrativa",
                                "IdUnidade": "110011999",
                                "Sigla": "SEPLAG/PROGERAIS",
                                "SinArquivamento": null,
                                "SinOuvidoria": null,
                                "SinProtocolo": null
                            }
                        }
                    }
                }
            ],
            "ProcedimentoFormatado": "1500.01.0250326/2023-04",
            "ProcedimentosAnexados": [],
            "ProcedimentosRelacionados": [
                {
                    "__values__": {
                        "IdProcedimento": "59770592",
                        "ProcedimentoFormatado": "1480.01.0007469/2022-70",
                        "TipoProcedimento": {
                            "__values__": {
                                "IdTipoProcedimento": "100048705",
                                "Nome": "SEDESE - Adesão ao Termo de Acordo - Piso Fixo"
                            }
                        }
                    }
                }
            ],
            "TipoProcedimento": {
                "__values__": {
                    "IdTipoProcedimento": "100000609",
                    "Nome": "Documentos Digitalizados na Ilha Central de Digitalização Cidade Administrativa"
                }
            },
            "UltimoAndamento": {
                "__values__": {
                    "Atributos": null,
                    "DataHora": "18/09/2023 14:51:10",
                    "Descricao": "Conclusão do processo na unidade",
                    "IdAndamento": null,
                    "IdTarefa": null,
                    "IdTarefaModulo": null,
                    "Unidade": {
                        "__values__": {
                            "Descricao": "Gabinete do Secretário Adjunto",
                            "IdUnidade": "110012912",
                            "Sigla": "SEF/SADJ",
                            "SinArquivamento": null,
                            "SinOuvidoria": null,
                            "SinProtocolo": null
                        }
                    },
                    "Usuario": {
                        "__values__": {
                            "IdUsuario": "100295218",
                            "Nome": "Ellen Silveira Reis",
                            "Sigla": "54981123604"
                        }
                    }
                }
            },
            "UnidadesProcedimentoAberto": []
        }
    },
    "status": "success",
    "tags": [
        {
            "id_tag": 4,
            "tag": "Outros"
        }
    ]
};

export async function POST(request) {
    try {
        await new Promise(resolve => setTimeout(resolve, 800));

        let reqSei = null;

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            reqSei = formData.get('sei');
        } else {
            const body = await request.json().catch(() => ({}));
            reqSei = body.sei;
        }

        // Return the mock data with the requested SEI number if provided
        const responseData = { ...mockProcessDetails };
        if (reqSei) {
            responseData.processo = {
                ...responseData.processo,
                sei: reqSei.toString()
            };
            responseData.sei.__values__.ProcedimentoFormatado = reqSei.toString();
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Mock Error:", error);
        return NextResponse.json({ error: 'Failed to fetch mock data' }, { status: 500 });
    }
}