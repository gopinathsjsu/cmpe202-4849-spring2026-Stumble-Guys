"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const auth_Preetam_1 = require("../middleware/auth_Preetam");
const validate_Pratham_1 = require("../middleware/validate_Pratham");
const authSchemas_Preetam_1 = require("../validators/authSchemas_Preetam");
const authController = __importStar(require("../controllers/authController_Preetam"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `avatar-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/;
        if (allowed.test(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
router.post('/register', (0, validate_Pratham_1.validate)(authSchemas_Preetam_1.registerSchema), authController.register);
router.post('/login', (0, validate_Pratham_1.validate)(authSchemas_Preetam_1.loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', auth_Preetam_1.authenticate, authController.logout);
router.get('/me', auth_Preetam_1.authenticate, authController.getProfile);
router.put('/me', auth_Preetam_1.authenticate, (0, validate_Pratham_1.validate)(authSchemas_Preetam_1.updateProfileSchema), authController.updateProfile);
router.put('/me/password', auth_Preetam_1.authenticate, (0, validate_Pratham_1.validate)(authSchemas_Preetam_1.changePasswordSchema), authController.changePassword);
router.post('/me/avatar', auth_Preetam_1.authenticate, upload.single('avatar'), authController.uploadAvatar);
exports.default = router;
