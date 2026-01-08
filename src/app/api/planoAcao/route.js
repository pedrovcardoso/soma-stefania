import { NextResponse } from 'next/server';

export async function POST(request) {
    const PLANO_ACAO_URL = process.env.PLANO_ACAO_URL;

    if (!PLANO_ACAO_URL) {
        return NextResponse.json({ error: 'Configuração PLANO_ACAO_URL não encontrada.' }, { status: 500 });
    }

    try {
        let body = {};
        const contentType = request.headers.get('content-type') || '';

        console.log('[Proxy] Request Content-Type:', contentType);

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            formData.forEach((value, key) => {
                body[key] = value;
            });
        } else if (contentType.includes('application/json')) {
            body = await request.json();
        }

        console.log('[Proxy] Sending to Power Automate:', JSON.stringify(body));

        const response = await fetch(PLANO_ACAO_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('[Proxy] Power Automate Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Proxy] Power Automate Error Detail:', errorText);
            return NextResponse.json({
                error: 'Erro ao consultar o Power Automate',
                status: response.status,
                detail: errorText
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Action Plan Proxy Error:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
