/**
 * UPI QR Code Generator Utility
 * Generates UPI payment links and QR codes without third-party payment gateways
 */

/**
 * Generate UPI payment string
 * @param {Object} params - Payment parameters
 * @param {string} params.upiId - UPI ID of the receiver (e.g., yourname@paytm)
 * @param {string} params.name - Name of the receiver
 * @param {number} params.amount - Amount to be paid
 * @param {string} params.transactionNote - Transaction note/description
 * @returns {string} UPI payment string
 */
export const generateUPIString = ({ upiId, name, amount, transactionNote }) => {
    // UPI URI format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=INR
    const params = new URLSearchParams({
        pa: upiId, // Payee address (UPI ID)
        pn: name, // Payee name
        am: amount.toFixed(2), // Amount
        tn: transactionNote || 'Box Cricket Booking', // Transaction note
        cu: 'INR', // Currency
    });

    return `upi://pay?${params.toString()}`;
};

/**
 * Generate QR code URL using Google Charts API (free, no authentication required)
 * @param {string} upiString - UPI payment string
 * @param {number} size - QR code size in pixels (default: 300)
 * @returns {string} QR code image URL
 */
export const generateQRCodeURL = (upiString, size = 300) => {
    const encodedUPI = encodeURIComponent(upiString);
    return `https://chart.googleapis.com/chart?cht=qr&chl=${encodedUPI}&chs=${size}x${size}&chld=L|0`;
};

/**
 * Generate complete UPI payment data
 * @param {Object} bookingData - Booking information
 * @returns {Object} UPI payment data with QR code URL
 */
export const generateUPIPayment = (bookingData) => {
    const { amount, bookingId, customerName } = bookingData;

    // Get UPI ID from environment variables
    const upiId = process.env.UPI_ID || 'yourname@paytm';
    const businessName = process.env.BUSINESS_NAME || "Shiva's Box Cricket";

    const transactionNote = `Booking ${bookingId} - ${customerName}`;

    // Generate UPI string
    const upiString = generateUPIString({
        upiId,
        name: businessName,
        amount,
        transactionNote,
    });

    // Generate QR code URL
    const qrCodeURL = generateQRCodeURL(upiString);

    return {
        upiId,
        businessName,
        amount,
        upiString,
        qrCodeURL,
        transactionNote,
    };
};

/**
 * Validate UPI Transaction ID format
 * @param {string} transactionId - UPI transaction ID to validate
 * @returns {boolean} True if valid format
 */
export const validateUPITransactionId = (transactionId) => {
    if (!transactionId || typeof transactionId !== 'string') {
        return false;
    }

    // UPI transaction IDs are typically 12 characters alphanumeric
    // Format can vary: 12 digits or alphanumeric
    const upiRegex = /^[A-Z0-9]{12,}$/i;
    return upiRegex.test(transactionId.trim());
};

/**
 * Format UPI transaction ID
 * @param {string} transactionId - Raw transaction ID
 * @returns {string} Formatted transaction ID (uppercase, trimmed)
 */
export const formatUPITransactionId = (transactionId) => {
    return transactionId.trim().toUpperCase();
};
