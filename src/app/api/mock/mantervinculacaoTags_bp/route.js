import { NextResponse } from 'next/server';

// "In-memory database" for tag linking
if (!global.mockTagLinks) {
  global.mockTagLinks = [
    { idtb_processo_tag: 4, tag: "OUTROS", processo: "1500.01.0250326/2023-04" }
  ];
}
let nextTagLinkId = 5;

export async function POST(request) {
  try {
    const body = await request.json();
    const { operacao, dados } = body;

    await new Promise(resolve => setTimeout(resolve, 400));

    switch (operacao) {
      case 'consultar':
        const filtered = global.mockTagLinks.filter(t => t.processo === dados.processo);
        return NextResponse.json({
          status: 'success',
          data: filtered
        });

      case 'inserir': {
        const { tag, processo } = dados;
        if (!tag || !processo) {
          return NextResponse.json({ status: 'error', message: 'Dados incompletos' }, { status: 400 });
        }

        const existing = global.mockTagLinks.find(t => t.tag.toUpperCase() === tag.toUpperCase() && t.processo === processo);
        if (existing) {
          return NextResponse.json({ status: 'success', message: 'Tag já vinculada' });
        }

        const newLink = { idtb_processo_tag: nextTagLinkId++, tag: tag.toUpperCase(), processo };
        global.mockTagLinks.push(newLink);

        return NextResponse.json({
          status: 'success',
          message: 'Nova tag vinculada com sucesso',
          idtb_processo_tag: newLink.idtb_processo_tag
        }, { status: 201 });
      }

      case 'excluir': {
        const { tag, processo } = dados;
        const idx = global.mockTagLinks.findIndex(t => t.tag === tag && t.processo === processo);
        if (idx === -1) {
          return NextResponse.json({ status: 'error', message: 'Vínculo não encontrado' }, { status: 404 });
        }
        global.mockTagLinks.splice(idx, 1);
        return NextResponse.json({
          status: 'success',
          message: 'Vínculo removido com sucesso',
          tag,
          processo
        });
      }

      default:
        return NextResponse.json({ status: 'error', message: 'Operação não suportada' }, { status: 400 });
    }
  } catch (error) {
    console.error("Mock Tag Links Error:", error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
