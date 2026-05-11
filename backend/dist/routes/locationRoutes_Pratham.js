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
const validate_Pratham_1 = require("../middleware/validate_Pratham");
const searchSchemas_Pratham_1 = require("../validators/searchSchemas_Pratham");
const locationController = __importStar(require("../controllers/locationController_Pratham"));
const searchController = __importStar(require("../controllers/searchController_Pratham"));
const notificationController = __importStar(require("../controllers/notificationController_Sasi"));
const router = (0, express_1.Router)();
router.get('/nearby', (0, validate_Pratham_1.validate)(searchSchemas_Pratham_1.nearbyQuerySchema, 'query'), locationController.getNearby);
router.get('/map', (0, validate_Pratham_1.validate)(searchSchemas_Pratham_1.mapBoundsSchema, 'query'), locationController.getMapEvents);
router.get('/trending', searchController.getTrending);
router.get('/saved', auth_Preetam_1.authenticate, locationController.getSavedEvents);
router.post('/:id/save', auth_Preetam_1.authenticate, locationController.saveEvent);
router.delete('/:id/save', auth_Preetam_1.authenticate, locationController.unsaveEvent);
router.get('/:id/stats', auth_Preetam_1.authenticate, locationController.getEventStats);
router.post('/:id/calendar', auth_Preetam_1.authenticate, notificationController.getCalendarFile);
exports.default = router;
