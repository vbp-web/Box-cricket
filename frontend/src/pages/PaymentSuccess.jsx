import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    useEffect(() => {
        if (!booking) {
            navigate('/');
        }
    }, [booking, navigate]);

    const handleDownloadInvoice = async () => {
        try {
            const response = await api.get(`/bookings/${booking._id}/invoice`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${booking.bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download invoice');
        }
    };

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
                        <CheckCircle size={64} className="mx-auto mb-4" />
                        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                        <p className="text-green-100">Your payment was successful</p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <p className="text-gray-600 mb-2">Booking ID</p>
                            <p className="text-2xl font-bold text-primary-600">{booking.bookingId}</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Turf Name</span>
                                <span className="font-semibold">{booking.turf?.name || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Date</span>
                                <span className="font-semibold">
                                    {format(new Date(booking.date), 'PPP')}
                                </span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Time</span>
                                <span className="font-semibold">
                                    {booking.startTime} - {booking.endTime}
                                </span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-semibold text-green-600">₹{booking.totalAmount}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b">
                                <span className="text-gray-600">Payment Status</span>
                                <span className="badge badge-success">{booking.paymentStatus}</span>
                            </div>

                            <div className="flex justify-between py-3">
                                <span className="text-gray-600">Booking Status</span>
                                <span className="badge badge-success">{booking.status}</span>
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-800 mb-2">Important Information</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Please arrive 10 minutes before your slot time</li>
                                <li>• Carry a valid ID proof</li>
                                <li>• Download your invoice for reference</li>
                                <li>• Contact support for any queries</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadInvoice}
                                className="btn-primary w-full flex items-center justify-center space-x-2"
                            >
                                <Download size={20} />
                                <span>Download Invoice</span>
                            </button>

                            <Link to="/" className="btn-secondary w-full flex items-center justify-center space-x-2">
                                <Home size={20} />
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        {/* Confirmation Message */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-600">
                                A confirmation email has been sent to{' '}
                                <span className="font-semibold">{booking.customerDetails?.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold mb-3">What's Next?</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-primary-600 font-semibold text-xs">1</span>
                            </div>
                            <div>
                                <p className="font-medium">Check your email</p>
                                <p className="text-gray-600">You'll receive a confirmation email with all details</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-primary-600 font-semibold text-xs">2</span>
                            </div>
                            <div>
                                <p className="font-medium">Prepare for your match</p>
                                <p className="text-gray-600">Bring your team and equipment</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-primary-600 font-semibold text-xs">3</span>
                            </div>
                            <div>
                                <p className="font-medium">Enjoy your game!</p>
                                <p className="text-gray-600">Have a great time at the turf</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
