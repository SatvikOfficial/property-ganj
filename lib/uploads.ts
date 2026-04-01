import { resolvePropertyMediaBucket } from '@/lib/property-media';
import { createAdminClient } from '@/utils/supabase/admin';

type UploadOptions = {
  folder: string;
  category?: string;
  fileName?: string;
  mimeType?: string;
};

type UploadResult = {
  url: string;
  publicId: string;
  bucket: string;
  path: string;
  provider: 'supabase';
};

function sanitizeExt(value?: string | null) {
  return value?.replace(/[^a-z0-9]/gi, '').toLowerCase() || null;
}

function guessExt(opts: UploadOptions) {
  const mimeExt = sanitizeExt(opts.mimeType?.split('/')[1]);
  if (mimeExt) return mimeExt;

  const fileExt = sanitizeExt(opts.fileName?.split('.').pop());
  if (fileExt) return fileExt;

  const folder = opts.folder.toLowerCase();
  if (folder.includes('floor')) return 'png';
  return 'jpg';
}

/**
 * Uploads a property media file to Supabase Storage.
 * Expects a public bucket (or signed URL flow should be added later).
 */
export async function uploadPropertyPhoto(buffer: Buffer, opts: UploadOptions): Promise<UploadResult> {
  const supabase = createAdminClient();
  const bucket = resolvePropertyMediaBucket(opts.category);
  const ext = guessExt(opts);
  const rawName = opts.fileName || `upload_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const fileStem = rawName.replace(/\.[^.]+$/, '');
  const safeName = fileStem.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${opts.folder.replace(/\/+$/g, '')}/${safeName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType: opts.mimeType || `image/${ext}`, upsert: true });

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
