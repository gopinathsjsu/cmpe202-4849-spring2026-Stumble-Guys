import nodemailer from 'nodemailer';
import { createTransporter } from '../config/email_Sasi';

export class EmailService {
  private static async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    try {
      const transporter = await createTransporter();

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"EventHub" <noreply@eventhub.com>',
        to,
        subject,
        html,
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email delivery failed');
    }
  }

  static async sendTicketConfirmation(
    email: string,
    ticketDetails: {
      ticketNumber: string;
      eventTitle: string;
      eventDate: string;
      venue: string;
      ticketType: string;
      quantity: number;
      totalAmount: number;
    }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Ticket Confirmation</h1>
        <p>Your ticket purchase was successful!</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">${ticketDetails.eventTitle}</h2>
          <p><strong>Ticket #:</strong> ${ticketDetails.ticketNumber}</p>
          <p><strong>Date:</strong> ${ticketDetails.eventDate}</p>
          <p><strong>Venue:</strong> ${ticketDetails.venue}</p>
          <p><strong>Type:</strong> ${ticketDetails.ticketType}</p>
          <p><strong>Quantity:</strong> ${ticketDetails.quantity}</p>
          <p><strong>Total:</strong> $${ticketDetails.totalAmount.toFixed(2)}</p>
        </div>
        <p>Please keep this email for your records. Show your ticket number at the venue entrance.</p>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `Ticket Confirmation - ${ticketDetails.eventTitle}`, html);
  }

  static async sendEventReminder(
    email: string,
    eventDetails: {
      eventTitle: string;
      eventDate: string;
      venue: string;
      slug: string;
    }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Event Reminder</h1>
        <p>Don't forget — your event is coming up soon!</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">${eventDetails.eventTitle}</h2>
          <p><strong>Date:</strong> ${eventDetails.eventDate}</p>
          <p><strong>Venue:</strong> ${eventDetails.venue}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `Reminder: ${eventDetails.eventTitle}`, html);
  }

  static async sendApprovalNotification(
    email: string,
    eventTitle: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    const isApproved = status === 'approved';
    const statusColor = isApproved ? '#22c55e' : '#ef4444';
    const statusLabel = isApproved ? 'Approved' : 'Rejected';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Event ${statusLabel}</h1>
        <p>Your event <strong>${eventTitle}</strong> has been 
          <span style="color: ${statusColor}; font-weight: bold;">${statusLabel.toLowerCase()}</span>.
        </p>
        ${notes ? `<div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;"><p><strong>Admin Notes:</strong> ${notes}</p></div>` : ''}
        ${isApproved ? '<p>Your event is now live and visible to attendees.</p>' : '<p>Please review the notes and consider updating your event for re-submission.</p>'}
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `Event ${statusLabel}: ${eventTitle}`, html);
  }

  static async sendRsvpDecisionEmail(
    email: string,
    input: {
      recipientName?: string;
      eventTitle: string;
      decision: 'approved' | 'rejected';
    }
  ): Promise<void> {
    const isApproved = input.decision === 'approved';
    const title = isApproved ? 'RSVP Approved' : 'RSVP Rejected';
    const accent = isApproved ? '#22c55e' : '#ef4444';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${accent};">${title}</h1>
        <p>
          ${input.recipientName ? `Hi ${input.recipientName},` : 'Hi,'}
        </p>
        <p>
          Your RSVP request for <strong>${input.eventTitle}</strong> was
          <strong>${isApproved ? ' approved' : ' rejected'}</strong>.
        </p>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `${title} — ${input.eventTitle}`, html);
  }

  static async sendEventChangedEmail(
    email: string,
    input: {
      recipientName?: string;
      eventTitle: string;
      changeType: 'updated' | 'cancelled';
      organizerName?: string;
    }
  ): Promise<void> {
    const isCancelled = input.changeType === 'cancelled';
    const heading = isCancelled ? 'Event Cancelled' : 'Event Updated';
    const accent = isCancelled ? '#ef4444' : '#4f46e5';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${accent};">${heading}</h1>
        <p>
          ${input.recipientName ? `Hi ${input.recipientName},` : 'Hi,'}
        </p>
        <p>
          The event <strong>${input.eventTitle}</strong> was ${
            isCancelled ? 'cancelled' : 'updated'
          }${input.organizerName ? ` by ${input.organizerName}` : ''}.
        </p>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `${heading} — ${input.eventTitle}`, html);
  }

  static async sendNewRsvpRequestEmail(
    email: string,
    input: {
      organizerName?: string;
      eventTitle: string;
      attendeeName?: string;
    }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">New RSVP Request</h1>
        <p>${input.organizerName ? `Hi ${input.organizerName},` : 'Hi,'}</p>
        <p>
          You have a new RSVP request${
            input.attendeeName ? ` from <strong>${input.attendeeName}</strong>` : ''
          } for <strong>${input.eventTitle}</strong>.
        </p>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `New RSVP Request — ${input.eventTitle}`, html);
  }

  static async sendAdminNewEventPendingEmail(
    email: string,
    input: {
      adminName?: string;
      eventTitle: string;
      organizerName?: string;
    }
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">New Event Pending Approval</h1>
        <p>${input.adminName ? `Hi ${input.adminName},` : 'Hi,'}</p>
        <p>
          A new event <strong>${input.eventTitle}</strong>${
            input.organizerName ? ` by ${input.organizerName}` : ''
          } is pending approval.
        </p>
        <p style="color: #6b7280; font-size: 12px;">— The EventHub Team</p>
      </div>
    `;

    await this.sendEmail(email, `Pending Approval — ${input.eventTitle}`, html);
  }
}
