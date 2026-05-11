"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketType = createTicketType;
exports.getTicketTypes = getTicketTypes;
exports.purchaseTicket = purchaseTicket;
exports.getMyTickets = getMyTickets;
exports.getTicketById = getTicketById;
exports.cancelTicket = cancelTicket;
const responseHelper_Pratham_1 = require("../utils/responseHelper_Pratham");
const ticketService_Sasi_1 = require("../services/ticketService_Sasi");
async function createTicketType(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const ticketType = await ticketService_Sasi_1.TicketService.createTicketType(id, userId, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, ticketType, 'Ticket type created', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to create ticket type', 'CREATE_TICKET_TYPE_ERROR', error.statusCode || 500);
    }
}
async function getTicketTypes(req, res) {
    try {
        const { id } = req.params;
        const ticketTypes = await ticketService_Sasi_1.TicketService.getTicketTypes(id);
        (0, responseHelper_Pratham_1.successResponse)(res, ticketTypes, 'Ticket types retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get ticket types', 'GET_TICKET_TYPES_ERROR', error.statusCode || 500);
    }
}
async function purchaseTicket(req, res) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const ticket = await ticketService_Sasi_1.TicketService.purchaseTicket(userId, id, req.body);
        (0, responseHelper_Pratham_1.successResponse)(res, ticket, 'Ticket purchased', 201);
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to purchase ticket', 'PURCHASE_TICKET_ERROR', error.statusCode || 500);
    }
}
async function getMyTickets(req, res) {
    try {
        const { userId } = req.user;
        const result = await ticketService_Sasi_1.TicketService.getMyTickets(userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result.data, 'Tickets retrieved', 200, {
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
        });
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get tickets', 'GET_TICKETS_ERROR', error.statusCode || 500);
    }
}
async function getTicketById(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const ticket = await ticketService_Sasi_1.TicketService.getTicketById(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, ticket, 'Ticket retrieved');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to get ticket', 'GET_TICKET_ERROR', error.statusCode || 500);
    }
}
async function cancelTicket(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const result = await ticketService_Sasi_1.TicketService.cancelTicket(id, userId);
        (0, responseHelper_Pratham_1.successResponse)(res, result, 'Ticket cancelled');
    }
    catch (error) {
        (0, responseHelper_Pratham_1.errorResponse)(res, error.message || 'Failed to cancel ticket', 'CANCEL_TICKET_ERROR', error.statusCode || 500);
    }
}
