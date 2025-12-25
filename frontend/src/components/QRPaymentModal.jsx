import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Copy, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const QRPaymentModal = ({ isOpen, onClose, amount, onPaymentComplete, bookingDetails }) => {
    const [transactionId, setTransactionId] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Your UPI details - UPDATE THESE WITH YOUR ACTUAL DETAILS
    const UPI_ID = "your-upi-id@paytm"; // Replace with your actual UPI ID
    const MERCHANT_NAME = "Shiva's Box Cricket";

    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Booking Payment')}`;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(UPI_ID);
        toast.success('UPI ID copied to clipboard!');
    };

    const handleScreenshotUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            setScreenshot(file);
            toast.success('Screenshot uploaded!');
        }
    };

    const handleSubmit = async () => {
        if (!transactionId.trim()) {
            toast.error('Please enter Transaction ID');
            return;
        }

        if (!screenshot) {
            toast.error('Please upload payment screenshot');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the payment completion handler
            await onPaymentComplete({
                transactionId: transactionId.trim(),
                screenshot: screenshot,
                paymentMethod: 'UPI/QR',
                amount: amount
            });
        } catch (error) {
            toast.error('Failed to submit payment details');
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Complete Payment</h2>
                        <p className="text-sm sm:text-base text-blue-100 mt-1">Scan QR or use UPI ID</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Amount Display */}
                    <div className="bg-primary-900 border-2 border-primary-600 rounded-lg p-4 text-center">
                        <p className="text-gray-300 text-sm sm:text-base mb-1">Amount to Pay</p>
                        <p className="text-3xl sm:text-4xl font-bold text-primary-400">₹{amount}</p>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
                        <div className="flex items-center justify-center mb-4">
                            <QrCode className="text-primary-500 mr-2" size={24} />
                            <h3 className="text-lg sm:text-xl font-bold text-gray-100">Scan QR Code</h3>
                        </div>

                        {/* QR Code Image - You need to add your actual QR code image */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg flex items-center justify-center mb-4">
                            <div className="text-center">
                                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                                    {/* Replace this div with your actual QR code image */}
                                    <div className="text-gray-600 text-center">
                                        <QrCode size={64} className="mx-auto mb-2" />
                                        <p className="text-sm">Add your QR code image here</p>
                                        <p className="text-xs mt-1">Path: /public/qr-code.png</p>
                                    </div>
                                    {/* Uncomment and use this when you have the QR code image:
                                    <img 
                                        src="/qr-code.png" 
                                        alt="Payment QR Code" 
                                        className="w-full h-full object-contain"
                                    />
                                    */}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Scan with any UPI app (Google Pay, PhonePe, Paytm)
                                </p>
                            </div>
                        </div>

                        {/* UPI ID */}
                        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-600">
                            <p className="text-xs sm:text-sm text-gray-400 mb-2">Or pay using UPI ID:</p>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-sm sm:text-base text-primary-400 font-mono break-all">{UPI_ID}</code>
                                <button
                                    onClick={handleCopyUPI}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                                    title="Copy UPI ID"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Payment Link */}
                        <div className="mt-4 sm:hidden">
                            <a
                                href={upiLink}
                                className="btn-primary w-full text-center block"
                            >
                                Pay with UPI App
                            </a>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-blue-200">
                                <p className="font-semibold mb-2">Payment Instructions:</p>
                                <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
                                    <li>Scan the QR code or use the UPI ID above</li>
                                    <li>Complete the payment of ₹{amount}</li>
                                    <li>Take a screenshot of the payment confirmation</li>
                                    <li>Enter the Transaction ID and upload screenshot below</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Transaction ID / UTR Number *
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter 12-digit transaction ID"
                                className="input-field text-sm sm:text-base"
                                maxLength="50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Find this in your payment app after successful payment
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Payment Screenshot *
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleScreenshotUpload}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-primary-500 transition-colors cursor-pointer bg-gray-900"
                                >
                                    <Upload size={20} className="text-gray-400" />
                                    <span className="text-sm sm:text-base text-gray-300">
                                        {screenshot ? screenshot.name : 'Click to upload screenshot'}
                                    </span>
                                </label>
                            </div>
                            {screenshot && (
                                <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle size={16} />
                                    <span>Screenshot uploaded successfully</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1 text-sm sm:text-base"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !transactionId.trim() || !screenshot}
                            className="btn-primary flex-1 text-sm sm:text-base"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
                        </button>
                    </div>

                    {/* Note */}
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-yellow-200">
                            <strong>Note:</strong> Your booking will be confirmed after admin verifies your payment.
                            You will receive a confirmation email/SMS within 5-10 minutes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRPaymentModal;
