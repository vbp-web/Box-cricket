import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, Users, MessageSquare, DollarSign, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminOfflineBooking = () => {
    const navigate = useNavigate();
    const [turfs, setTurfs] = useState([]);
    const [selectedTurf, setSelectedTurf] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        email: '',
        numberOfPlayers: '',
        specialRequests: '',
        amountPaid: ''
    });

    useEffect(() => {
        fetchTurfs();
    }, []);

    useEffect(() => {
        if (selectedTurf && selectedDate) {
            fetchSlots();
        }
    }, [selectedTurf, selectedDate]);

    const fetchTurfs = async () => {
        try {
            const response = await api.get('/turfs');
            setTurfs(response.data.data.turfs);
            if (response.data.data.turfs.length > 0) {
                setSelectedTurf(response.data.data.turfs[0]._id);
            }
        } catch (error) {
            toast.error('Failed to fetch turfs');
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/slots/${selectedTurf}?date=${selectedDate}`);
            // Filter only available slots
            const availableSlots = response.data.data.slots.filter(
                slot => slot.status === 'available'
            );
            setSlots(availableSlots);
        } catch (error) {
            toast.error('Failed to fetch slots');
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

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        // Auto-fill amount with slot price
        setCustomerDetails(prev => ({
            ...prev,
            amountPaid: slot.price.toString()
        }));
    };

    const validateForm = () => {
        if (!selectedSlot) {
            toast.error('Please select a slot');
            return false;
        }
        if (!customerDetails.name.trim()) {
            toast.error('Please enter customer name');
            return false;
        }
        if (!customerDetails.phone.trim()) {
            toast.error('Please enter customer phone number');
            return false;
        }
        if (!/^[6-9]\d{9}$/.test(customerDetails.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        if (customerDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
            toast.error('Please enter a valid email');
            return false;
        }
        if (!customerDetails.amountPaid || customerDetails.amountPaid <= 0) {
            toast.error('Please enter amount paid');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setProcessing(true);

        try {
            await api.post('/bookings/offline', {
                slotId: selectedSlot._id,
                customerDetails: {
                    name: customerDetails.name,
                    phone: customerDetails.phone,
                    email: customerDetails.email || undefined
                },
                numberOfPlayers: customerDetails.numberOfPlayers || undefined,
                specialRequests: customerDetails.specialRequests || undefined,
                paymentMethod: 'cash',
                amountPaid: Number(customerDetails.amountPaid)
            });

            toast.success('Offline booking created successfully!');

            // Reset form
            setSelectedSlot(null);
            setCustomerDetails({
                name: '',
                phone: '',
                email: '',
                numberOfPlayers: '',
                specialRequests: '',
                amountPaid: ''
            });

            // Refresh slots
            fetchSlots();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setProcessing(false);
        }
    };

    const selectedTurfData = turfs.find(t => t._id === selectedTurf);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Offline Booking</h1>
                        <p className="text-gray-600 mt-2">Book slots for walk-in customers</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="btn-secondary"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Slot Selection */}
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Select Slot</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Turf
                                    </label>
                                    <select
                                        value={selectedTurf}
                                        onChange={(e) => {
                                            setSelectedTurf(e.target.value);
                                            setSelectedSlot(null);
                                        }}
                                        className="input-field"
                                    >
                                        {turfs.map((turf) => (
                                            <option key={turf._id} value={turf._id}>
                                                {turf.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setSelectedSlot(null);
                                        }}
                                        className="input-field"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Available Slots */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">Available Slots</h2>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="spinner"></div>
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">No available slots for this date</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot._id}
                                            onClick={() => handleSlotSelect(slot)}
                                            className={`p-4 rounded-lg border-2 transition-all ${selectedSlot?._id === slot._id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock size={16} className="text-gray-600" />
                                                <span className="font-semibold text-sm">
                                                    {slot.startTime} - {slot.endTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600">
                                                <DollarSign size={14} />
                                                <span className="font-bold">₹{slot.price}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Customer Details Form */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

                        {selectedSlot ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Selected Slot Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm font-medium text-blue-800 mb-2">Selected Slot</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-600" />
                                            <span className="font-semibold text-blue-900">
                                                {selectedSlot.startTime} - {selectedSlot.endTime}
                                            </span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">
                                            ₹{selectedSlot.price}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            Customer Name *
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerDetails.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            Phone Number *
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

                                {/* Email (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} />
                                            Email (Optional)
                                        </div>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerDetails.email}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="customer@example.com"
                                    />
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
                                        max={selectedTurfData?.capacity}
                                    />
                                </div>

                                {/* Amount Paid */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} />
                                            Amount Paid (₹) *
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        name="amountPaid"
                                        value={customerDetails.amountPaid}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Amount received"
                                        min="0"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Slot price: ₹{selectedSlot.price}
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
                                        placeholder="Any special requirements..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} />
                                    {processing ? 'Creating Booking...' : 'Confirm Booking'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">Please select a slot to continue</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOfflineBooking;
