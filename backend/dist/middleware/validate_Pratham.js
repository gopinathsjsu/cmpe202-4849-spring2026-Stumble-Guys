"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
function validate(schema, source = 'body') {
    return (req, res, next) => {
        const parsed = schema.safeParse(req[source]);
        if (!parsed.success) {
            const zodError = parsed.error;
            (0, responseHelper_Pratham_1.errorResponse)(res, 'Validation failed', 'VALIDATION_ERROR', 400, formatZodIssues(zodError));
            return;
        }
        if (source === 'body') {
            req.body = parsed.data;
        }
        else if (source === 'query') {
            req.query = parsed.data;
        }
        else {
            req.params = parsed.data;
        }
        next();
    };
}
function formatZodIssues(error) {
    const fieldErrors = error.flatten().fieldErrors;
    const fields = {};
    for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
            fields[key] = messages;
        }
    }
    return {
        fields,
        issues: error.issues,
    };
}
