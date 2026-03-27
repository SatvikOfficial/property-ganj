import { createClient } from '@/utils/supabase/server';

type UploadOptions = {
  folder: string;
  category?: string;
  fileName?: string;
};

type UploadResult = {
  url: string;
  publicId: string;
  bucket: string;
  path: string;
  provider: 'supabase';
};

function guessExtFromFolder(folder: string) {
  const f = folder.toLowerCase();
  if (f.includes('floor')) return 'png';
  return 'jpg';
}

/**
 * Uploads a property media file to Supabase Storage.
 * Expects a public bucket (or signed URL flow should be added later).
 */
export async function uploadPropertyPhoto(buffer: Buffer, opts: UploadOptions): Promise<UploadResult> {
  const supabase = await createClient();

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'property-media';
  const ext = guessExtFromFolder(opts.folder);
  const safeName = (opts.fileName || `upload_${Date.now()}_${Math.random().toString(16).slice(2)}`).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${opts.folder.replace(/\/+$/g, '')}/${safeName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: `image/${ext}`, upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Failed to resolve public URL');

  return {
    url: data.publicUrl,
    publicId: path,
    bucket,
    path,
    provider: 'supabase',
  };
}
