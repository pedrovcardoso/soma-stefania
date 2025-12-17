import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 500));

    return new NextResponse("Login realizado com sucesso", {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
}
