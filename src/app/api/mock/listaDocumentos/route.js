import { NextResponse } from 'next/server';

export async function POST(request) {
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
        "documentos": [
            {
                "data": "30/11/2021",
                "documento": "52683779",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Planilha (teste)",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18675381&id_documento=81456960&infra_hash=9d770c4b99c1e129e386894ef2d0dc6b"
            },
            {
                "data": "09/08/2022",
                "documento": "60660864",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Portaria",
                "unidade": "FAPEMIG/PRES",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69231582&infra_hash=6e4398cc6fd4e24bd0b3a850506cf833"
            },
            {
                "data": "01/09/2022",
                "documento": "52443478",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Email",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60069870&infra_hash=c49bdf5739ec44caa34e05d1e5645248"
            },
            {
                "data": "01/09/2022",
                "documento": "52443479",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60069871&infra_hash=dd4ef37bd367d669bf1687c8065c76da"
            },
            {
                "data": "01/09/2022",
                "documento": "52443481",
                "no_azure": "Sim",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Portaria",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60069873&infra_hash=4a5576ac2d3618ca4da91bf9028098f5"
            },
            {
                "data": "01/09/2022",
                "documento": "52443483",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Relat�rio",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60069875&infra_hash=ee73bcc0b77d1394e335654301011bd5"
            },
            {
                "data": "01/09/2022",
                "documento": "52443484",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio 39",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60069880&infra_hash=131479edf47d226696c73a95b8370761"
            },
            {
                "data": "06/09/2022",
                "documento": "52695599",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60350114&infra_hash=34fe3e0af50f75814560d571580b6d1d"
            },
            {
                "data": "09/09/2022",
                "documento": "52851913",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 955",
                "unidade": "SEF/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=60524121&infra_hash=2f1c7d6dd57598a60b8573706cc75c97"
            },
            {
                "data": "10/02/2023",
                "documento": "60660674",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Email",
                "unidade": "FAPEMIG/PRES",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69231420&infra_hash=f2b1fcf8ea452fe8a9bf710672297a69"
            },
            {
                "data": "10/02/2023",
                "documento": "60660829",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio",
                "unidade": "FAPEMIG/PRES",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69231499&infra_hash=9e3dac522a1ba21c9791e74485b8bb71"
            },
            {
                "data": "10/02/2023",
                "documento": "60660774",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Requisi��o",
                "unidade": "FAPEMIG/PRES",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69231553&infra_hash=9842ec14066a4d959c1551a56a0e3dd6"
            },
            {
                "data": "10/02/2023",
                "documento": "60660869",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Memorando 13",
                "unidade": "FAPEMIG/PRES",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69231593&infra_hash=abf8ea7110b511657c556c6ce8518e36"
            },
            {
                "data": "14/02/2023",
                "documento": "60817587",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio 4",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69406947&infra_hash=05de17d2d9f62ce455c24ff524c8b754"
            },
            {
                "data": "16/02/2023",
                "documento": "60913725",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 163",
                "unidade": "SEF/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69514358&infra_hash=280d111260bd28a6bcca1719bbc2f52c"
            },
            {
                "data": "24/02/2023",
                "documento": "61210117",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio 229",
                "unidade": "SEF/STE-SCAF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=69844955&infra_hash=7e0468bd10dff6ad3a12eb49f957ce9c"
            },
            {
                "data": "16/06/2023",
                "documento": "67924638",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Email",
                "unidade": "FAPEMIG/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=77362869&infra_hash=db8ac956b65c2282df130f290f0193ad"
            },
            {
                "data": "16/06/2023",
                "documento": "67926970",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio",
                "unidade": "FAPEMIG/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=77365462&infra_hash=1e38108cc62511126fff3b06eee27ec9"
            },
            {
                "data": "16/06/2023",
                "documento": "67927882",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 86",
                "unidade": "FAPEMIG/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=77366467&infra_hash=30981ab9e7b093788266beafcc22802f"
            },
            {
                "data": "13/08/2023",
                "documento": "71459431",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Relat�rio",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81295372&infra_hash=cf973b1d9c1dd79abc6cca3338440e99"
            },
            {
                "data": "14/08/2023",
                "documento": "71459392",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio 25",
                "unidade": "FAPEMIG/DPGF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81295393&infra_hash=cc9a568e8cd9c89cdb250822975ada70"
            },
            {
                "data": "16/08/2023",
                "documento": "71537726",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 831",
                "unidade": "SEF/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81383867&infra_hash=bd644717eba2215088e6087f9173c83f"
            },
            {
                "data": "16/08/2023",
                "documento": "71555929",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 158",
                "unidade": "SEF/STE",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81404143&infra_hash=a6f60d72c5d4e0a22f14d6eaec105aa5"
            },
            {
                "data": "22/08/2023",
                "documento": "71958543",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 168",
                "unidade": "SEF/STE-SCAF",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81853423&infra_hash=700770aadbb8847c17acfc3b2e96c05d"
            },
            {
                "data": "22/08/2023",
                "documento": "72014270",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Nota T�cnica",
                "unidade": "SEF/STE-SCCG",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81915674&infra_hash=5b3c6ea5612811503f7f3d51dc7e4ac8"
            },
            {
                "data": "23/08/2023",
                "documento": "72014970",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 61",
                "unidade": "SEF/STE-SCCG",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81916430&infra_hash=3695e85930335d5b5d11bc341486afe3"
            },
            {
                "data": "23/08/2023",
                "documento": "72053942",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Of�cio 45",
                "unidade": "SEF/STE",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=81960242&infra_hash=dfae5da6a3025608e01ae12272207cf7"
            },
            {
                "data": "24/08/2023",
                "documento": "72155448",
                "no_azure": "Não",
                "processo_origem": "2070.01.0003808/2022-05",
                "tipo": "Despacho 139",
                "unidade": "FAPEMIG/GAB",
                "url": "https://www.sei.mg.gov.br/sei/documento_consulta_externa.php?id_acesso_externo=18643495&id_documento=82073853&infra_hash=a17a8c8e962e465bffff041f7bac2bb4"
            }
        ],
        "status": "success",
        "total": 28
    });
}
