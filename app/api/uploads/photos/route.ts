import { NextRequest, NextResponse } from 'next/server';

import { uploadPropertyPhoto } from '@/lib/uploads';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const category = (formData.get('category') as string) || 'other';

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (file.type && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image uploads are supported' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadPropertyPhoto(buffer, {
      folder: `property-ganj/${category}`,
      category,
      fileName: file.name,
      mimeType: file.type || undefined,
    });

    return NextResponse.json(
      {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        bucket: uploadResult.bucket,
        path: uploadResult.path,
        category,
        provider: uploadResult.provider,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Photo upload failed:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
