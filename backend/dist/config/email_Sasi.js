"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResendClient = getResendClient;
exports.createTransporter = createTransporter;
const resend_1 = require("resend");
let resendClient = null;
function getResendClient() {
    if (!resendClient) {
        resendClient = new resend_1.Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}
// Keep createTransporter export so existing emailService_Sasi.ts still compiles
// (it won't be called when RESEND_API_KEY is set)
async function createTransporter() {
    throw new Error('Use Resend instead of Nodemailer');
}
