import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const generateXlsx = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ['Processo', 'Tipo', 'Unidade', 'Data', 'Status'],
        ['2070.01.0003808/2022-05', 'Portaria', 'FAPEMIG/PRES', '09/08/2022', 'Aprovado'],
        ['2070.01.0003808/2022-05', 'Relatório', 'FAPEMIG/DPGF', '30/11/2021', 'Em análise'],
        ['2070.01.0003808/2022-05', 'Minuta', 'FAPEMIG/DPGF', '01/09/2022', 'Pendente'],
        ['2070.01.0003808/2022-05', 'Despacho', 'SEF/GAB', '09/09/2022', 'Aprovado'],
        ['2070.01.0003808/2022-05', 'Ofício', 'FAPEMIG/GAB', '16/06/2023', 'Concluído'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Documentos');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

const generateCsv = () => {
    const rows = [
        'Processo,Tipo,Unidade,Data,Status',
        '2070.01.0003808/2022-05,Portaria,FAPEMIG/PRES,09/08/2022,Aprovado',
        '2070.01.0003808/2022-05,Relatório,FAPEMIG/DPGF,30/11/2021,Em análise',
        '2070.01.0003808/2022-05,Minuta,FAPEMIG/DPGF,01/09/2022,Pendente',
    ];
    return rows.join('\n');
};

export async function GET(request, { params }) {
    const { filename } = await params;
    const ext = path.extname(filename).toLowerCase();

    if (ext === '.xlsx') {
        const buffer = generateXlsx();
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control': 'no-store',
            },
        });
    }

    if (ext === '.csv') {
        const csv = generateCsv();
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Cache-Control': 'no-store',
            },
        });
    }

    const filePath = path.join(process.cwd(), 'public', 'mock', 'listaDocumentos', filename);
    if (ext === '.msg') {
        return new NextResponse('Preview not available', { status: 404 });
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.zip': 'application/zip',
            '.msg': 'application/octet-stream',
        };
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': mimeTypes[ext] || 'application/octet-stream',
                'Cache-Control': 'no-store',
            },
        });
    }

    return new NextResponse('File not found', { status: 404 });
}
