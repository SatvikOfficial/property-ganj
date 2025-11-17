import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(process.env.CLOUDINARY_URL);

if (isCloudinaryConfigured) {
  cloudinary.config({
    secure: true,
  });
}

type UploadOptions = {
  folder?: string;
  category?: string;
  fileName?: string;
};

type UploadResult = {
  url: string;
  publicId?: string | null;
  provider: 'cloudinary' | 'placeholder';
};

export async function uploadPropertyPhoto(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured) {
    const safeLabel = encodeURIComponent(options.category || 'Property');
    return {
      url: `https://placehold.co/800x600?text=${safeLabel}`,
      publicId: null,
      provider: 'placeholder',
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'property-ganj',
        public_id: options.fileName,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          provider: 'cloudinary',
        });
      }
    );

    uploadStream.end(buffer);
  });
}

