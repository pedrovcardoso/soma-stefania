import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const usuario = formData.get('usuario');

    if (!usuario) {
      return NextResponse.json({ status: 'error', message: 'Usuário não fornecido' }, { status: 400 });
    }

    // Mock data based on the provided user
    return NextResponse.json(
      {
        data: [
          {
            id_unidade: 110001563,
            sigla: 'SEF/STE',
            unidade: 'Subsecretaria do Tesouro Estadual',
          },
          {
            id_unidade: 110014683,
            sigla: 'SEF/STE-PLANEJAMENTO',
            unidade: 'Subsecretaria do Tesouro Estadual/Planejamento',
          },
        ],
        status: 'success',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mock listaracessos error:', error);
    return NextResponse.json({ status: 'error', message: 'Erro interno do servidor' }, { status: 500 });
  }
}
