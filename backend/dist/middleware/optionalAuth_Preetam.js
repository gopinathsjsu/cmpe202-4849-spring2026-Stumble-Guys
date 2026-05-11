"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = optionalAuthenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_Preetam_1 = require("../config/jwt_Preetam");
function optionalAuthenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = header.slice('Bearer '.length).trim();
    if (!token) {
        next();
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_Preetam_1.jwtConfig.secret);
        const userId = decoded.userId ?? decoded.sub;
        const email = decoded.email;
        const role = decoded.role;
        if (userId && email && role) {
            req.user = { userId, email, role };
        }
    }
    catch {
        // ignore invalid token for public routes
    }
    next();
}
