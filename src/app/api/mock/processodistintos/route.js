
import { NextResponse } from 'next/server';

const MOCKED_PROCESSES = [
    { "sei": "1080.01.0003291/2024-17" },
    { "sei": "1080.01.0007687/2023-56" },
    { "sei": "1080.01.0020985/2024-04" },
    { "sei": "1080.01.0036989/2025-28" },
    { "sei": "1080.01.0037910/2023-96" },
    { "sei": "1080.01.0059023/2024-14" },
    { "sei": "1080.01.0059851/2024-65" },
    { "sei": "1080.01.0073157/2023-94" },
    { "sei": "1080.01.0107903/2024-36" }
];

export async function GET() {
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
        data: MOCKED_PROCESSES,
        status: "success"
    });
}
