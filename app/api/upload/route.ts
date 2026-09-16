import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const form = await req.formData();

    const files = form
      .getAll('files')
      .filter((x) => x instanceof File) as File[];

    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      if (file.size > 8 * 1024 * 1024) {
        continue;
      }

      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const result = await new Promise<any>(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            {
              folder: 'alwatar-realestate',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          upload.end(buffer);
        }
      );

      urls.push(result.secure_url);
    }

    return NextResponse.json({ urls });
  } catch (e: any) {
    console.error('Cloudinary upload error:', e);

    return NextResponse.json(
      {
        error:
          e?.message === 'UNAUTHORIZED'
            ? 'غير مصرح'
            : 'فشل رفع الصور',
      },
      {
        status:
          e?.message === 'UNAUTHORIZED'
            ? 401
            : 400,
      }
    );
  }
}