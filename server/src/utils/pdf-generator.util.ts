import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export class PdfGeneratorUtil {
  static async generateDonationReceipt(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Donation Receipt', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt ID: ${data.receiptId}`);
      doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`);
      doc.text(`Donor: ${data.donorName}`);
      doc.text(`Campaign: ${data.campaignTitle}`);
      doc.text(`Amount: $${data.amount}`);
      doc.text(`Payment Method: ${data.paymentMethod}`);
      doc.moveDown();
      doc.text('Thank you for your contribution!', { align: 'center' });

      doc.end();
    });
  }

  static async generateYearlyReport(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Yearly Donation Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Year: ${data.year}`);
      doc.text(`Donor: ${data.donorName}`);
      doc.moveDown();
      doc.fontSize(12).text(`Total Donations: ${data.totalDonations}`);
      doc.text(`Total Amount: $${data.totalAmount}`);
      doc.moveDown();
      doc.text('Donation Breakdown:');
      data.donations.forEach((donation: any, index: number) => {
        doc.text(
          `${index + 1}. ${donation.campaignTitle} - $${donation.amount} (${new Date(donation.date).toLocaleDateString()})`,
        );
      });

      doc.end();
    });
  }

  static async generateAdminReport(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Global Impact Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Period: ${data.period}`);
      doc.moveDown();
      doc.fontSize(12).text(`Total Campaigns: ${data.totalCampaigns}`);
      doc.text(`Total Donations: ${data.totalDonations}`);
      doc.text(`Total Amount Raised: $${data.totalAmount}`);
      doc.text(`Active NGOs: ${data.activeNGOs}`);
      doc.text(`Active Donors: ${data.activeDonors}`);
      doc.text(`Volunteer Hours: ${data.volunteerHours}`);

      doc.end();
    });
  }
}
