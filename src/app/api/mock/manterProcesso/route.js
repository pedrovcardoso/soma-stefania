import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { operacao, dados } = body;

        console.log(`[Mock API] /manterProcesso - Operação: ${operacao}`, dados);

        await new Promise(resolve => setTimeout(resolve, 800));

        if (!operacao || !dados) {
            return NextResponse.json({
                status: 'error',
                message: 'Parâmetros operacao e dados são obrigatórios.'
            }, { status: 400 });
        }

        switch (operacao) {
            case 'inserir':
                return NextResponse.json({
                    status: 'success',
                    message: 'Processo inserido com sucesso!',
                    data: { ...dados, id: dados.sei }
                }, { status: 201 });

            case 'alterar':
                return NextResponse.json({
                    status: 'success',
                    message: 'Processo atualizado com sucesso!',
                    data: dados
                });

            case 'excluir':
                return NextResponse.json({
                    status: 'success',
                    message: 'Processo removido com sucesso!'
                });

            default:
                return NextResponse.json({
                    status: 'error',
                    message: 'Operação inválida. Use inserir, alterar ou excluir.'
                }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Erro interno ao processar requisição.'
        }, { status: 500 });
    }
}
