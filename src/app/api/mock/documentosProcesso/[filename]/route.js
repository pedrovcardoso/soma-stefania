
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const map = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.zip': 'application/zip',
        '.odt': 'application/vnd.oasis.opendocument.text',
        '.eml': 'message/rfc822',
        '.msg': 'application/vnd.ms-outlook',
    };
    return map[ext] || 'application/octet-stream';
};

export async function GET(request, { params }) {
    const { filename } = params;

    // Security check: ensure no directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/app/api/mock/documentosProcesso', filename);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filename);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${filename}"`,
        },
    });
}
