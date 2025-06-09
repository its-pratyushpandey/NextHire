import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import fs from 'fs';
import path from 'path';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const loadTemplate = (templateName: string): string => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
  return fs.readFileSync(templatePath, 'utf-8');
};

export const sendEmail = async ({ to, subject, template, data }: EmailData): Promise<void> => {
  try {
    // Load email template
    const templateContent = loadTemplate(template);
    const compiledTemplate = compile(templateContent);
    const html = compiledTemplate(data);
    
    // Send email
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
}; 