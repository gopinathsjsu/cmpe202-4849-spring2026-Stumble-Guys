"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
const auth_Preetam_1 = require("../middleware/auth_Preetam");
const router = (0, express_1.Router)();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined,
});
const BUCKET = process.env.AWS_S3_BUCKET || 'eventhub-uploads-842806122556';
const REGION = process.env.AWS_REGION || 'us-east-1';
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/;
        if (allowed.test(file.mimetype))
            cb(null, true);
        else
            cb(new Error('Only image files are allowed'));
    },
});
router.post('/event-image', auth_Preetam_1.authenticate, upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
        return;
    }
    try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const key = `events/event-${uniqueSuffix}${path_1.default.extname(file.originalname)}`;
        await s3.send(new client_s3_1.PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
        res.json({ success: true, data: { url } });
    }
    catch (err) {
        console.error('S3 upload error:', err);
        res.status(500).json({ success: false, error: { code: 'UPLOAD_FAILED', message: 'Image upload failed' } });
    }
});
exports.default = router;
