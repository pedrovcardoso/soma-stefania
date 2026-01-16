import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const seiNumber = formData.get('sei');

        console.log(`[Mock API] /prepararImportacao - SEI: ${seiNumber}`);

        await new Promise(resolve => setTimeout(resolve, 600));

        if (!seiNumber) {
            return NextResponse.json({
                status: 'error',
                message: 'Parâmetro sei é obrigatório.'
            }, { status: 400 });
        }

        return NextResponse.json({
            sei: {
                __values__: {
                    ProcedimentoFormatado: seiNumber,
                    LinkAcesso: `https://sei.mg.gov.br/sei/controlador.php?acao=procedimento_selecionar&id_procedimento=${seiNumber}`,
                    UltimoAndamento: {
                        __values__: {
                            DataHora: new Date().toISOString(),
                            Unidade: {
                                __values__: {
                                    Descricao: "SEF/DIREÇÃO - Belo Horizonte"
                                }
                            }
                        }
                    },
                    ProcedimentosRelacionados: [],
                    ProcedimentosAnexados: []
                }
            },
            tags: [
                { id: 1, tag: "Importado do SEI" },
                { id: 2, tag: "Aguardando Classificação" }
            ]
        });

    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Erro interno ao preparar importação.'
        }, { status: 500 });
    }
}
