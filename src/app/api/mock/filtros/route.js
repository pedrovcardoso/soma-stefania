import { NextResponse } from 'next/server';

export async function GET() {
  // Simula um delay de rede (500ms) para parecer real
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Dados fictícios baseados no contexto da SEF/MG
  const mockData = {
    "anos": [
      2025,
      2024,
      2023,
      2022,
      2020
    ],
    "status": [
      "Acompanhamento especial",
      "Aguarda resposta",
      "Em atraso",
      "Em consolidação",
      "Finalizado com Desdobramentos",
      "Finalizado e Concluído",
      "Planejado",
      "Vence amanhã",
      "Vencendo hoje"
    ],
    "tipos": [
      "Acompanhamento",
      "Auditoria",
      "Balanço Geral do Estado",
      "Denúncia",
      "Inspeção Ordinária",
      "Monitoramento",
      "Outros",
      "Relatório Temático",
      "Representação",
      "Solicitação TCE/CFAMGE",
      "Tomada de Contas Especial"
    ]
  };

  return NextResponse.json(mockData, { status: 200 });
}