import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { authenticate } from '../middleware/auth_Preetam';

const router = Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  } : undefined,
});

const BUCKET = process.env.AWS_S3_BUCKET || 'eventhub-uploads-842806122556';
const REGION = process.env.AWS_REGION || 'us-east-1';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.post('/event-image', authenticate, upload.single('image'), async (req, res) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) {
    res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
    return;
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const key = `events/event-${uniqueSuffix}${path.extname(file.originalname)}`;

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
    res.json({ success: true, data: { url } });
  } catch (err) {
    console.error('S3 upload error:', err);
    res.status(500).json({ success: false, error: { code: 'UPLOAD_FAILED', message: 'Image upload failed' } });
  }
});

export default router;
