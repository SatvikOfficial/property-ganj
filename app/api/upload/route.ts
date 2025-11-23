import { NextRequest, NextResponse } from 'next/server';
import { uploadPropertyPhoto } from '@/lib/uploads';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadPropertyPhoto(buffer, {
            folder: 'property-ganj/agents',
            category: 'Agent Profile',
        });

        return NextResponse.json({ url: result.url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
