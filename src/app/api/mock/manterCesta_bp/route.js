import { NextResponse } from 'next/server';

// "In-memory database" using global object for persistence between requests during dev
if (!global.mockBaskets) {
  global.mockBaskets = [
    { id_cesta: 1, cesta: "Teste" },
    { id_cesta: 2, cesta: "teste2" },
    { id_cesta: 3, cesta: "nova cesta de testes" }
  ];
}
let nextId = 4;

export async function POST(request) {
  try {
    const body = await request.json();
    const { operacao, dados } = body;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (operacao) {
      case 'consultar':
        return NextResponse.json({
          data: global.mockBaskets.map(b => ({ cesta: b.cesta })),
          status: 'success'
        });

      case 'inserir': {
        const { cesta } = dados;
        // Check for duplicates
        if (global.mockBaskets.some(b => b.cesta.toLowerCase() === cesta.toLowerCase())) {
           return NextResponse.json({
             message: "Já existe uma cesta com esse nome",
             status: "error"
           });
        }
        
        const newBasket = { id_cesta: nextId++, cesta };
        global.mockBaskets.push(newBasket);
        
        return NextResponse.json({
          id_cesta: newBasket.id_cesta,
          message: "Cesta criada com sucesso", // Mocking success message
          status: "success"
        });
      }

      case 'alterar': {
        const { cesta_original, cesta } = dados;

        // Check for duplicate on rename
        if (cesta_original.toLowerCase() !== cesta.toLowerCase() && 
            global.mockBaskets.some(b => b.cesta.toLowerCase() === cesta.toLowerCase())) {
            return NextResponse.json({
              message: "Já existe uma cesta com esse nome",
              status: "error"
            });
        }

        const idx = global.mockBaskets.findIndex(b => b.cesta === cesta_original);
        if (idx === -1) {
            return NextResponse.json({ message: "Cesta não encontrada", status: "error" });
        }
        
        global.mockBaskets[idx].cesta = cesta;

        // Also update any links in the other mock (if it exists)
        if (global.mockBasketLinks) {
            for (const process in global.mockBasketLinks) {
                const links = global.mockBasketLinks[process];
                const linkIdx = links.indexOf(cesta_original);
                if (linkIdx !== -1) {
                    global.mockBasketLinks[process][linkIdx] = cesta;
                }
            }
        }

        return NextResponse.json({
          id_cesta: global.mockBaskets[idx].id_cesta,
          message: "Cesta atualizada com sucesso",
          status: "success"
        });
      }

      case 'excluir': {
        const { cesta } = dados;
        const idx = global.mockBaskets.findIndex(b => b.cesta === cesta);
        if (idx === -1) {
            return NextResponse.json({ message: "Cesta não encontrada", status: "error" });
        }

        const deletedId = global.mockBaskets[idx].id_cesta;
        global.mockBaskets.splice(idx, 1);

        // Also clean up any links in the other mock
        if (global.mockBasketLinks) {
            for (const process in global.mockBasketLinks) {
                global.mockBasketLinks[process] = global.mockBasketLinks[process].filter(b => b !== cesta);
            }
        }

        return NextResponse.json({
          id_cesta: deletedId,
          message: "Cesta excluída com sucesso",
          status: "success"
        });
      }

      default:
        return NextResponse.json({ status: 'error', message: 'Operação inválida' }, { status: 400 });
    }

  } catch (error) {
    console.error(`Error in mock manterCesta_bp:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
