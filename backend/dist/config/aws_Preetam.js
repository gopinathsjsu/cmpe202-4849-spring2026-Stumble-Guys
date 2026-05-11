"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsConfig = void 0;
exports.awsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET || 'eventhub-uploads',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
