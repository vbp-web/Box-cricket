import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, IndianRupee, CreditCard, User, Phone, Mail, Users, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import QRPaymentModal from '../components/QRPaymentModal';
import { formatTimeShort } from '../utils/timeFormat';

const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [turf, setTurf] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    // Customer details form state
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: '',
        numberOfPlayers: '',
        specialRequests: ''
    });

    useEffect(() => {
        fetchSlotDetails();
        // Pre-fill user details if logged in
        if (user) {
            setCustomerDetails(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [searchParams, user]);

    const fetchSlotDetails = async () => {
        try {
            // Get slot IDs from query parameters
            const slotIdsParam = searchParams.get('slots');
            if (!slotIdsParam) {
                toast.error('No slots selected');
                navigate('/');
                return;
            }

            const slotIds = slotIdsParam.split(',');

            // Fetch all slots
            const slotPromises = slotIds.map(id => api.get(`/slots/slot/${id}`));
            const slotResponses = await Promise.all(slotPromises);

            const fetchedSlots = slotResponses.map(res => res.data.data.slot);
            setSlots(fetchedSlots);

            // Get turf from first slot (all slots should be from same turf)
            if (fetchedSlots[0].turf) {
                setTurf(fetchedSlots[0].turf);
            } else {
                // Fallback: fetch turf separately if not populated
                const turfResponse = await api.get(`/turfs/${fetchedSlots[0].turf}`);
                setTurf(turfResponse.data.data.turf);
            }
        } catch (error) {
            toast.error('Failed to fetch booking details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!customerDetails.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }
        if (!customerDetails.email.trim()) {
            toast.error('Please enter your email');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
            toast.error('Please enter a valid email');
            return false;
        }
        if (!customerDetails.phone.trim()) {
            toast.error('Please enter your phone number');
            return false;
        }
        if (!/^[6-9]\d{9}$/.test(customerDetails.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const handlePayment = async () => {
        // Validate form first
        if (!validateForm()) {
            return;
        }

        try {
            setProcessing(true);

            // Create booking with customer details for multiple slots
            const bookingResponse = await api.post('/bookings', {
                slotIds: slots.map(s => s._id),
                customerDetails: {
                    name: customerDetails.name,
                    email: customerDetails.email,
                    phone: customerDetails.phone
                },
                numberOfPlayers: customerDetails.numberOfPlayers || undefined,
                specialRequests: customerDetails.specialRequests || undefined
            });

            const bookingData = bookingResponse.data.data.booking;
            setBooking(bookingData);
            setProcessing(false);

            // Show QR Payment Modal
            setShowQRModal(true);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
            setProcessing(false);
        }
    };

    const handlePaymentComplete = async (paymentData) => {
        try {
            // Validate booking exists
            if (!booking || !booking._id) {
                toast.error('Booking information is missing. Please try again.');
                setShowQRModal(false);
                return;
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('bookingId', booking._id);
            formData.append('transactionId', paymentData.transactionId);
            formData.append('paymentMethod', paymentData.paymentMethod);
            formData.append('amount', paymentData.amount);
            formData.append('screenshot', paymentData.screenshot);

            // Submit payment details to backend
            const response = await api.post('/payment/qr-payment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Payment details submitted successfully!');
            setShowQRModal(false);

            // Navigate to success page
            navigate('/payment-success', {
                state: {
                    booking: response.data.data.booking,
                    isPending: true // Indicates payment is pending verification
                },
            });

        } catch (error) {
            console.error('Payment submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit payment details');
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!slots.length || !turf) {
        return null;
    }

    // Calculate total price
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);

    return (
        <div className="min-h-screen bg-gray-900 py-6 sm:py-8 lg:py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4 sm:p-6">
                        <h1 className="text-xl sm:text-2xl font-bold">Confirm Your Booking</h1>
                        <p className="text-blue-100 mt-1 text-sm sm:text-base">Review details and proceed to payment</p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Turf Info */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Turf Details</h2>
                            <div className="flex items-start space-x-4">
                                <img
                                    src={turf.images[0]?.url || 'https://via.placeholder.com/150'}
                                    alt={turf.name}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{turf.name}</h3>
                                    <div className="flex items-center text-gray-600 mt-1">
                                        <MapPin size={16} className="mr-1" />
                                        <span className="text-sm">{turf.location.address}, {turf.location.city}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Info */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-3">Booking Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Calendar size={20} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-semibold">{format(new Date(slots[0].date), 'PPP')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Clock size={20} className="text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Selected Time Slots ({slots.length})</p>
                                        <div className="space-y-1">
                                            {slots.map((slot, index) => (
                                                <div key={slot._id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                                                    <span className="font-semibold text-sm text-gray-900">{formatTimeShort(slot.startTime)} - {formatTimeShort(slot.endTime)}</span>
                                                    <span className="text-primary-600 font-medium">₹{slot.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details Form */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-4">Your Details</h2>
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            Full Name *
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerDetails.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                {/* Email and Phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} />
                                                Email Address *
                                            </div>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={customerDetails.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} />
                                                Mobile Number *
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={customerDetails.phone}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                            pattern="[6-9][0-9]{9}"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Number of Players */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} />
                                            Number of Players (Optional)
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfPlayers"
                                        value={customerDetails.numberOfPlayers}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g., 22"
                                        min="1"
                                        max={turf.capacity}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maximum capacity: {turf.capacity} players
                                    </p>
                                </div>

                                {/* Special Requests */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={16} />
                                            Special Requests (Optional)
                                        </div>
                                    </label>
                                    <textarea
                                        name="specialRequests"
                                        value={customerDetails.specialRequests}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        rows="3"
                                        placeholder="Any special requirements or requests..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-3">Price Details</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-700">
                                    <span>Slot Price ({slots.length} slot{slots.length > 1 ? 's' : ''})</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Platform Fee</span>
                                    <span>₹0</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <div className="flex items-center text-primary-600">
                                            <IndianRupee size={20} />
                                            <span>{totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• This slot is locked for 3 minutes</li>
                                <li>• Complete payment before the timer expires</li>
                                <li>• Cancellation policy: No refund after payment</li>
                                <li>• Please arrive 10 minutes before your slot time</li>
                            </ul>
                        </div>

                        {/* Payment Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                            <CreditCard size={20} />
                            <span>{processing ? 'Processing...' : 'Proceed to Payment'}</span>
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            By proceeding, you agree to our terms and conditions
                        </p>
                    </div>
                </div>
            </div>

            {/* QR Payment Modal */}
            <QRPaymentModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                amount={totalPrice}
                onPaymentComplete={handlePaymentComplete}
                bookingDetails={booking}
            />
        </div>
    );
};

export default BookingPage;
