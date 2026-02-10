import { Resend } from 'resend';
import * as React from 'react';

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@oiko.store';
const COMPANY_NAME = 'Oiko';

// Only initialize Resend if API key is configured
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface SendWelcomeEmailParams {
  to: string;
  firstName: string;
}

export interface SendOrderConfirmationParams {
  to: string;
  orderRef: string;
  orderPoints: number;
  orderUrl?: string;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail({
  to,
  firstName,
}: SendWelcomeEmailParams) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping welcome email.');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Welcome to Oiko',
      html: getWelcomeEmailHTML(firstName, to),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log('Welcome email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail({
  to,
  orderRef,
  orderPoints,
  orderUrl,
}: SendOrderConfirmationParams) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping order confirmation email.');
      return { success: false, error: 'Email service not configured' };
    }

    const ctaUrl = orderUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/account`;

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: `Order ${orderRef} confirmed`,
      html: getOrderConfirmationEmailHTML(ctaUrl, orderPoints),
    });

    if (error) {
      console.error('Failed to send order confirmation email:', error);
      return { success: false, error: error.message };
    }

    console.log('Order confirmation email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate welcome email HTML
 */
function getWelcomeEmailHTML(firstName: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Oiko</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 32px;">
          <div style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b6b6b;">Oiko</div>
          <h1 style="margin: 16px 0 12px; font-size: 22px; font-weight: 600;">Welcome, ${firstName}</h1>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            You've joined something deliberate.
          </p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            Every piece in our collection carries intention. From sustainable materials to
            timeless design, we create clothing that matters.
          </p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">
            As you shop, you'll earn fragment points—a way to track your journey with us.
            Collect them, unlock rewards, and become part of the Oiko story.
          </p>
          <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #6b6b6b;">
            Your account: ${email}
          </p>
          <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products" style="display: inline-block; margin-top: 20px; padding: 12px 18px; border: 1px solid #111111; border-radius: 999px; color: #111111; text-decoration: none; font-size: 14px; font-weight: 600;">
            Explore collection
          </a>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send order shipped email
 */
export async function sendOrderShippedEmail({
  to,
  orderRef,
  trackingNumber,
  trackingUrl,
}: {
  to: string;
  orderRef: string;
  trackingNumber?: string;
  trackingUrl?: string;
}) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping order shipped email.');
      return { success: false, error: 'Email service not configured' };
    }

    const ctaUrl = trackingUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/account`;

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Your order is on its way',
      html: getOrderShippedEmailHTML(ctaUrl, orderRef, trackingNumber),
    });

    if (error) {
      console.error('Failed to send order shipped email:', error);
      return { success: false, error: error.message };
    }

    console.log('Order shipped email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending order shipped email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order delivered email
 */
export async function sendOrderDeliveredEmail({
  to,
  orderRef,
}: {
  to: string;
  orderRef: string;
}) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping order delivered email.');
      return { success: false, error: 'Email service not configured' };
    }

    const ctaUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/rewards`;

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Delivered',
      html: getOrderDeliveredEmailHTML(ctaUrl, orderRef),
    });

    if (error) {
      console.error('Failed to send order delivered email:', error);
      return { success: false, error: error.message };
    }

    console.log('Order delivered email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending order delivered email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate order confirmation email HTML
 */
function getOrderConfirmationEmailHTML(ctaUrl: string, orderPoints: number): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your order is in motion</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 32px;">
          <div style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b6b6b;">Oiko</div>
          <h1 style="margin: 16px 0 12px; font-size: 22px; font-weight: 600;">Your order is in motion</h1>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">Thank you for choosing Oiko.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">Your piece has been received.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">This order added +${orderPoints} fragments to your journey.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">It's now part of the process.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">We'll let you know when it moves forward.</p>
          <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #6b6b6b;">You can view your order anytime in your account.</p>
          <a href="${ctaUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 18px; border: 1px solid #111111; border-radius: 999px; color: #111111; text-decoration: none; font-size: 14px; font-weight: 600;">
            View order
          </a>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate order shipped email HTML
 */
function getOrderShippedEmailHTML(ctaUrl: string, orderRef: string, trackingNumber?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your order is on its way</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 32px;">
          <div style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b6b6b;">Oiko</div>
          <h1 style="margin: 16px 0 12px; font-size: 22px; font-weight: 600;">Your order is on its way</h1>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">Your order has left our hands.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">It's moving toward you now.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">We'll notify you once it arrives.</p>
          ${trackingNumber ? `
            <div style="margin-top: 16px; padding: 12px 14px; border: 1px solid #e5e5e5; border-radius: 12px;">
              <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b6b6b; margin-bottom: 6px;">Shipping details</div>
              <p style="margin: 0 0 6px; font-size: 13px; line-height: 1.6; color: #2f2f2f;">Order #: ${orderRef}</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2f2f2f;">Tracking: ${trackingNumber}</p>
            </div>
          ` : ''}
          <a href="${ctaUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 18px; border: 1px solid #111111; border-radius: 999px; color: #111111; text-decoration: none; font-size: 14px; font-weight: 600;">
            Track order
          </a>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generic email sender (for custom HTML emails like password reset)
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    // Check if Resend is configured
    if (!resend || !process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping email.');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate order delivered email HTML
 */
function getOrderDeliveredEmailHTML(ctaUrl: string, orderRef: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delivered</title>
      </head>
      <body style="margin: 0; padding: 32px 16px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111; background-color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 32px;">
          <div style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b6b6b;">Oiko</div>
          <h1 style="margin: 16px 0 12px; font-size: 22px; font-weight: 600;">Delivered</h1>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">Your order has arrived.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">This step matters.</p>
          <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.7; color: #2f2f2f;">Each order forms a fragment.</p>
          <div style="margin-top: 16px; padding: 12px 14px; border: 1px solid #e5e5e5; border-radius: 12px;">
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #2f2f2f;">Order #: ${orderRef}</p>
          </div>
          <p style="margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: #6b6b6b;">You can see how this fits into your rewards journey.</p>
          <a href="${ctaUrl}" style="display: inline-block; margin-top: 20px; padding: 12px 18px; border: 1px solid #111111; border-radius: 999px; color: #111111; text-decoration: none; font-size: 14px; font-weight: 600;">
            View rewards journey
          </a>
        </div>
      </body>
    </html>
  `;
}
