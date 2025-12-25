import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = async (booking, user, turf) => {
    return new Promise((resolve, reject) => {
        try {
            // Create invoices directory if it doesn't exist
            const invoicesDir = path.join(__dirname, '../invoices');
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }

            const fileName = `invoice-${booking.bookingId}.pdf`;
            const filePath = path.join(invoicesDir, fileName);

            // Create PDF document
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc
                .fontSize(20)
                .fillColor('#2563eb')
                .text("SHIVA'S HUB", 50, 50)
                .fontSize(10)
                .fillColor('#666')
                .text('Box Cricket Turf Booking', 50, 75)
                .text('Kalol, Gujarat', 50, 90)
                .text('Phone: +91 98765 43210', 50, 105)
                .text('Email: info@shivashub.com', 50, 120);

            // Invoice Title
            doc
                .fontSize(24)
                .fillColor('#000')
                .text('INVOICE', 400, 50, { align: 'right' });

            // Invoice Details
            doc
                .fontSize(10)
                .fillColor('#666')
                .text(`Invoice #: ${booking.bookingId}`, 400, 80, { align: 'right' })
                .text(`Date: ${new Date(booking.createdAt).toLocaleDateString('en-IN')}`, 400, 95, { align: 'right' })
                .text(`Status: ${booking.status.toUpperCase()}`, 400, 110, { align: 'right' });

            // Line
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, 150)
                .lineTo(550, 150)
                .stroke();

            // Customer Details
            doc
                .fontSize(12)
                .fillColor('#000')
                .text('BILL TO:', 50, 170)
                .fontSize(10)
                .fillColor('#666')
                .text(user.name, 50, 190)
                .text(user.email, 50, 205)
                .text(user.phone, 50, 220);

            // Booking Details
            doc
                .fontSize(12)
                .fillColor('#000')
                .text('BOOKING DETAILS:', 300, 170)
                .fontSize(10)
                .fillColor('#666')
                .text(`Turf: ${turf.name}`, 300, 190)
                .text(`Location: ${turf.location.address}, ${turf.location.city}`, 300, 205)
                .text(`Date: ${new Date(booking.date).toLocaleDateString('en-IN')}`, 300, 220)
                .text(`Time: ${booking.startTime} - ${booking.endTime}`, 300, 235);

            // Table Header
            const tableTop = 280;
            doc
                .fontSize(10)
                .fillColor('#fff')
                .rect(50, tableTop, 500, 25)
                .fill('#2563eb');

            doc
                .fillColor('#fff')
                .text('Description', 60, tableTop + 8)
                .text('Date', 250, tableTop + 8)
                .text('Time', 350, tableTop + 8)
                .text('Amount', 480, tableTop + 8);

            // Table Row
            doc
                .fillColor('#000')
                .text('Box Cricket Turf Booking', 60, tableTop + 38)
                .text(new Date(booking.date).toLocaleDateString('en-IN'), 250, tableTop + 38)
                .text(`${booking.startTime} - ${booking.endTime}`, 350, tableTop + 38)
                .text(`₹${booking.totalAmount}`, 480, tableTop + 38);

            // Line
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, tableTop + 65)
                .lineTo(550, tableTop + 65)
                .stroke();

            // Total
            doc
                .fontSize(12)
                .fillColor('#000')
                .text('TOTAL AMOUNT:', 350, tableTop + 80)
                .fontSize(14)
                .fillColor('#2563eb')
                .text(`₹${booking.totalAmount}`, 480, tableTop + 78);

            // Payment Status
            doc
                .fontSize(10)
                .fillColor('#666')
                .text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`, 350, tableTop + 105);

            // Footer
            doc
                .fontSize(9)
                .fillColor('#999')
                .text(
                    'Thank you for choosing Shiva\'s Hub! For any queries, contact us at support@shivashub.com',
                    50,
                    700,
                    { align: 'center', width: 500 }
                )
                .text('This is a computer-generated invoice and does not require a signature.', 50, 720, {
                    align: 'center',
                    width: 500,
                });

            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};
