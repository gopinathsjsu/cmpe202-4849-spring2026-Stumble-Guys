"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_Preetam_1 = require("../config/jwt_Preetam");
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Authentication required', 'UNAUTHORIZED', 401);
        return;
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Authentication required', 'UNAUTHORIZED', 401);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_Preetam_1.jwtConfig.secret);
        const userId = decoded.userId ?? decoded.sub;
        const email = decoded.email;
        const role = decoded.role;
        if (!userId || !email || !role) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Invalid token payload', 'UNAUTHORIZED', 401);
            return;
        }
        req.user = {
            userId,
            email,
            role,
        };
        next();
    }
    catch {
        (0, responseHelper_Pratham_1.errorResponse)(res, 'Invalid or expired token', 'UNAUTHORIZED', 401);
    }
}
