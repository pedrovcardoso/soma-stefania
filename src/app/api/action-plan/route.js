import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { sei } = body;

        if (!sei) {
            return NextResponse.json({ message: 'SEI number is required' }, { status: 400 });
        }

        const PLANO_ACAO_URL = process.env.PLANO_ACAO_URL;

        if (!PLANO_ACAO_URL) {
            console.error('PLANO_ACAO_URL not defined');
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(PLANO_ACAO_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sei: sei }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ message: errorText || 'Error from PowerAutomate' }, { status: response.status });
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const text = await response.text();
            return NextResponse.json({ message: text, raw: text });
        }

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
