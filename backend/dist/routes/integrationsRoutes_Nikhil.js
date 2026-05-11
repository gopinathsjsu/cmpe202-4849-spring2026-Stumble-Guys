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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_Preetam_1 = require("../middleware/auth_Preetam");
const integrationsController = __importStar(require("../controllers/integrationsController_Nikhil"));
const router = (0, express_1.Router)();
router.get('/google-calendar/callback', integrationsController.googleCalendarOAuthCallback);
router.get('/google-calendar/connect', auth_Preetam_1.authenticate, integrationsController.googleCalendarConnectUrl);
router.post('/google-calendar/disconnect', auth_Preetam_1.authenticate, integrationsController.googleCalendarDisconnect);
router.get('/google-calendar/status', auth_Preetam_1.authenticate, integrationsController.googleCalendarStatus);
router.post('/google-calendar/events/:eventId', auth_Preetam_1.authenticate, integrationsController.googleCalendarPushEvent);
exports.default = router;
