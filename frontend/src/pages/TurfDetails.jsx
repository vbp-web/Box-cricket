import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Calendar, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';
import SlotGrid from '../components/SlotGrid';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TurfDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [turf, setTurf] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [lockedSlots, setLockedSlots] = useState([]);

    useEffect(() => {
        fetchTurfDetails();
    }, [id]);

    useEffect(() => {
        if (turf) {
            fetchSlots();
        }
    }, [selectedDate, turf]);

    const fetchTurfDetails = async () => {
        try {
            const response = await api.get(`/turfs/${id}`);
            setTurf(response.data.data.turf);
        } catch (error) {
            toast.error('Failed to fetch turf details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        try {
            const response = await api.get(`/slots/${id}?date=${selectedDate}`);
            setSlots(response.data.data.slots);
        } catch (error) {
            toast.error('Failed to fetch slots');
        }
    };

    const handleSlotSelect = async (slot) => {
        if (!isAuthenticated) {
            toast.error('Please login to book a slot');
            navigate('/login');
            return;
        }

        try {
            setSelectedSlot(slot);

            // Lock the slot
            const response = await api.post('/slots/lock', { slotId: slot._id });

            setLockedSlots([...lockedSlots, slot._id]);
            toast.success('Slot locked for 3 minutes');

            // Navigate to booking page
            setTimeout(() => {
                navigate(`/booking/${slot._id}`);
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to lock slot');
            setSelectedSlot(null);
        }
    };

    const getDateOptions = () => {
        const today = new Date();
        return [
            { label: 'Today', value: format(today, 'yyyy-MM-dd') },
            { label: 'Tomorrow', value: format(addDays(today, 1), 'yyyy-MM-dd') },
        ];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!turf) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Turf Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="h-96 rounded-xl overflow-hidden">
                        <img
                            src={turf.images[0]?.url || 'https://via.placeholder.com/800x600'}
                            alt={turf.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {turf.images.slice(1, 5).map((image, index) => (
                            <div key={index} className="h-44 rounded-xl overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={`${turf.name} ${index + 2}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Turf Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{turf.name}</h1>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center">
                                    <Star size={20} className="text-yellow-400 fill-current mr-1" />
                                    <span className="font-semibold">{turf.rating}</span>
                                    <span className="text-gray-500 ml-1">({turf.totalReviews} reviews)</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin size={18} className="mr-1" />
                                    <span>{turf.location.address}, {turf.location.city}</span>
                                </div>
                            </div>

                            <div className="flex items-center text-primary-600 font-bold text-2xl mb-6">
                                <IndianRupee size={24} />
                                <span>{turf.pricePerHour}/hour</span>
                            </div>

                            <p className="text-gray-700 mb-6">{turf.description}</p>

                            {/* Facilities */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Facilities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {turf.facilities.map((facility, index) => (
                                        <span key={index} className="badge badge-info">
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Turf Type:</span>
                                    <p className="font-medium">{turf.turfType}</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Capacity:</span>
                                    <p className="font-medium">{turf.capacity} players</p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Dimensions:</span>
                                    <p className="font-medium">
                                        {turf.dimensions.length} x {turf.dimensions.width} {turf.dimensions.unit}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">Operating Hours:</span>
                                    <p className="font-medium">
                                        {turf.operatingHours.open} - {turf.operatingHours.close}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                            <h3 className="text-xl font-bold mb-4">Book Your Slot</h3>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {getDateOptions().map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSelectedDate(option.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${selectedDate === option.value
                                                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                    : 'border-gray-300 hover:border-primary-300'
                                                }`}
                                        >
                                            <Calendar size={18} className="mx-auto mb-1" />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Available Slots
                                </label>
                                {slots.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No slots available</p>
                                ) : (
                                    <SlotGrid
                                        slots={slots}
                                        onSlotSelect={handleSlotSelect}
                                        selectedSlot={selectedSlot}
                                        lockedSlots={lockedSlots}
                                    />
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-6 pt-6 border-t">
                                <p className="text-xs text-gray-600 mb-2">Legend:</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded mr-2"></div>
                                        <span>Locked</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded mr-2"></div>
                                        <span>Booked</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurfDetails;
