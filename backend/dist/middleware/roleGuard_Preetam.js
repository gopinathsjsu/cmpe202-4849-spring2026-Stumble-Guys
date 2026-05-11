"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Authentication required', 'UNAUTHORIZED', 401);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Insufficient permissions', 'FORBIDDEN', 403);
            return;
        }
        next();
    };
}
