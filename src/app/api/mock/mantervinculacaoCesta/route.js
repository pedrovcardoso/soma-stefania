import { NextResponse } from 'next/server';

// "In-memory database" using global object for persistence between requests during dev
if (!global.mockBasketLinks) {
  global.mockBasketLinks = {};
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { operacao, dados } = body;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (operacao === 'consultar') {
      const processo = dados?.processo;
      if (!processo) {
        return NextResponse.json({ status: 'error', message: 'Processo não informado' }, { status: 400 });
      }

      const activeBaskets = global.mockBasketLinks[processo] || [];
      const data = activeBaskets.map(cesta => ({ cesta }));
      
      return NextResponse.json({
        data,
        status: 'success'
      });
    }

    return NextResponse.json({ status: 'error', message: 'Operação inválida' }, { status: 400 });

  } catch (error) {
    console.error('Error in mock mantervinculacaoCesta:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
