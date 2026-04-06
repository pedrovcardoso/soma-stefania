import { NextResponse } from 'next/server';

// "In-memory database" for tags
if (!global.mockTags) {
  global.mockTags = [
    { id_tag: 1, tag: "URGENTE" },
    { id_tag: 2, tag: "FISCALIZACAO" },
    { id_tag: 3, tag: "AUDITORIA" },
    { id_tag: 4, tag: "OUTROS" }
  ];
}
let nextTagId = 5;

export async function POST(request) {
  try {
    const body = await request.json();
    const { operacao, dados } = body;

    await new Promise(resolve => setTimeout(resolve, 400));

    switch (operacao) {
      case 'consultar':
        return NextResponse.json({
          status: 'success',
          data: global.mockTags
        });

      case 'inserir': {
        const { tag } = dados;
        if (!tag) {
          return NextResponse.json({ status: 'error', message: 'Tag não informada' }, { status: 400 });
        }

        const existing = global.mockTags.find(t => t.tag.toUpperCase() === tag.toUpperCase());
        if (existing) {
          return NextResponse.json({ status: 'success', message: 'Tag já existe', id_tag: existing.id_tag });
        }

        const newTag = { id_tag: nextTagId++, tag: tag.toUpperCase() };
        global.mockTags.push(newTag);

        return NextResponse.json({
          status: 'success',
          message: 'Nova tag criada com sucesso',
          id_tag: newTag.id_tag
        }, { status: 201 });
      }

      case 'alterar': {
        const { tag_original, tag } = dados;
        const idx = global.mockTags.findIndex(t => t.tag === tag_original);
        if (idx === -1) {
          return NextResponse.json({ status: 'error', message: 'Tag não encontrada' }, { status: 404 });
        }
        global.mockTags[idx].tag = tag.toUpperCase();
        return NextResponse.json({
          status: 'success',
          message: 'Tag alterada com sucesso',
          id_tag: global.mockTags[idx].id_tag
        });
      }

      case 'excluir': {
        const { tag } = dados;
        const idx = global.mockTags.findIndex(t => t.tag === tag);
        if (idx === -1) {
          return NextResponse.json({ status: 'error', message: 'Tag não encontrada' }, { status: 404 });
        }
        const deletedId = global.mockTags[idx].id_tag;
        global.mockTags.splice(idx, 1);
        return NextResponse.json({
          status: 'success',
          message: 'Tag excluída com sucesso',
          id_tag: deletedId
        });
      }

      default:
        return NextResponse.json({ status: 'error', message: 'Operação não suportada' }, { status: 400 });
    }
  } catch (error) {
    console.error("Mock Tags Error:", error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
