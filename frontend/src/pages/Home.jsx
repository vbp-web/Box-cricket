import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Calendar, Clock, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import SlotGrid from '../components/SlotGrid';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [turfs, setTurfs] = useState([]); // All turfs (Box 1 and Box 2)
    const [selectedBox, setSelectedBox] = useState(null); // Currently selected box
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [lockedSlots, setLockedSlots] = useState([]);

    useEffect(() => {
        fetchTurfDetails();
    }, []);

    useEffect(() => {
        if (selectedBox) {
            fetchSlots();
        }
    }, [selectedDate, selectedBox]);

    const fetchTurfDetails = async () => {
        try {
            setLoading(true);
            // Fetch all turfs (Box 1 and Box 2)
            console.log('Fetching turfs from API...');
            const response = await api.get('/turfs?limit=10');
            console.log('API Response:', response);
            const fetchedTurfs = response.data.data.turfs;
            console.log('Turfs array:', fetchedTurfs);

            if (fetchedTurfs && fetchedTurfs.length > 0) {
                // Sort by box number
                const sortedTurfs = fetchedTurfs.sort((a, b) => a.boxNumber - b.boxNumber);
                setTurfs(sortedTurfs);
                // Default to Box 1
                setSelectedBox(sortedTurfs[0]);
                console.log('Turfs loaded, Box 1 selected by default');
            } else {
                console.error('No turfs found in response');
                toast.error('Turf information not available');
            }
        } catch (error) {
            console.error('Error fetching turfs:', error);
            toast.error('Failed to fetch turf details');
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        try {
            const response = await api.get(`/slots/${selectedBox._id}?date=${selectedDate}`);
            setSlots(response.data.data.slots);
        } catch (error) {
            toast.error('Failed to fetch slots');
        }
    };

    const handleSlotSelect = (slot) => {
        if (!isAuthenticated) {
            toast.error('Please login to book a slot');
            navigate('/login');
            return;
        }

        // Toggle slot selection
        setSelectedSlots(prev => {
            const isAlreadySelected = prev.some(s => s._id === slot._id);
            if (isAlreadySelected) {
                // Remove slot
                return prev.filter(s => s._id !== slot._id);
            } else {
                // Add slot (sorted by time)
                const newSlots = [...prev, slot].sort((a, b) => {
                    const timeA = a.startTime.split(':').map(Number);
                    const timeB = b.startTime.split(':').map(Number);
                    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
                });
                return newSlots;
            }
        });
    };

    const handleProceedToBooking = async () => {
        if (selectedSlots.length === 0) {
            toast.error('Please select at least one slot');
            return;
        }

        try {
            // Lock all selected slots
            const lockPromises = selectedSlots.map(slot =>
                api.post('/slots/lock', { slotId: slot._id })
            );

            await Promise.all(lockPromises);

            const slotIds = selectedSlots.map(s => s._id);
            setLockedSlots([...lockedSlots, ...slotIds]);
            toast.success(`${selectedSlots.length} slot(s) locked for 3 minutes`);

            // Navigate to booking page with multiple slot IDs
            setTimeout(() => {
                navigate(`/booking?slots=${slotIds.join(',')}`);
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to lock slots');
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

    if (!selectedBox) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 text-lg">Turf information not available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 via-primary-900 to-black text-white border-b-4 border-primary-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in">
                            Shiva's Box Cricket
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-orange-200 px-4">
                            Premium Box Cricket Experience in Kalol
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-6 space-y-3 sm:space-y-0 text-orange-100 px-4">
                            <div className="flex items-center">
                                <MapPin size={20} className="mr-2 flex-shrink-0" />
                                <span className="text-sm sm:text-base">{selectedBox.location.address}, {selectedBox.location.city}</span>
                            </div>
                            <div className="flex items-center">
                                <Star size={20} className="text-yellow-400 fill-current mr-1 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base">{selectedBox.rating}</span>
                                <span className="ml-1 text-sm sm:text-base">({selectedBox.totalReviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                {/* Turf Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={selectedBox.images[0]?.url || 'https://via.placeholder.com/800x600'}
                            alt={selectedBox.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {selectedBox.images.slice(1, 5).map((image, index) => (
                            <div key={index} className="h-32 sm:h-36 md:h-44 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src={image.url}
                                    alt={`${selectedBox.name} ${index + 2}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info and Booking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* About */}
                        <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">About Our Turf</h2>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{selectedBox.description}</p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4">Pricing</h3>
                            <div className="flex items-center text-primary-500 font-bold text-2xl sm:text-3xl">
                                <IndianRupee size={24} className="sm:w-7 sm:h-7" />
                                <span>{selectedBox.pricePerHour}</span>
                                <span className="text-base sm:text-lg text-gray-400 ml-2">/hour</span>
                            </div>
                        </div>

                        {/* Facilities */}
                        <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4">Facilities</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                {selectedBox.facilities.map((facility, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle size={18} className="text-primary-500 flex-shrink-0" />
                                        <span className="text-sm sm:text-base text-gray-300">{facility}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-700">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 sm:mb-4">Additional Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <span className="text-sm text-gray-400 block mb-1">Turf Type</span>
                                    <p className="text-sm sm:text-base font-medium text-gray-100">{selectedBox.turfType}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-400 block mb-1">Capacity</span>
                                    <p className="text-sm sm:text-base font-medium text-gray-100">{selectedBox.capacity} players</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-400 block mb-1">Dimensions</span>
                                    <p className="text-sm sm:text-base font-medium text-gray-100">
                                        {selectedBox.dimensions.length} x {selectedBox.dimensions.width} {selectedBox.dimensions.unit}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-400 block mb-1">Operating Hours</span>
                                    <p className="text-sm sm:text-base font-medium text-gray-100">
                                        {selectedBox.operatingHours.open} - {selectedBox.operatingHours.close}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-20 border-2 border-primary-600">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-100">Book Your Slot</h3>

                            {/* Box Selection */}
                            {turfs.length > 1 && (
                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                        Select Box
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {turfs.map((turf) => (
                                            <button
                                                key={turf._id}
                                                onClick={() => {
                                                    setSelectedBox(turf);
                                                    setSelectedSlots([]); // Clear selected slots when switching boxes
                                                }}
                                                className={`p-2 sm:p-3 rounded-lg border-2 transition-all touch-target ${selectedBox._id === turf._id
                                                    ? 'border-primary-500 bg-primary-900 text-primary-400'
                                                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-primary-500'
                                                    }`}
                                            >
                                                <span className="text-xs sm:text-sm font-bold block">Box {turf.boxNumber}</span>
                                                <span className="text-xs opacity-75 hidden sm:block">{turf.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Date Selection */}
                            <div className="mb-4 sm:mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                    Select Date
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {getDateOptions().map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSelectedDate(option.value)}
                                            className={`p-2 sm:p-3 rounded-lg border-2 transition-all touch-target ${selectedDate === option.value
                                                ? 'border-primary-500 bg-primary-900 text-primary-400'
                                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-primary-500'
                                                }`}
                                        >
                                            <Calendar size={16} className="sm:w-5 sm:h-5 mx-auto mb-1" />
                                            <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3">
                                    Available Slots
                                </label>
                                {slots.length === 0 ? (
                                    <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No slots available</p>
                                ) : (
                                    <>
                                        <SlotGrid
                                            slots={slots}
                                            onSlotSelect={handleSlotSelect}
                                            selectedSlots={selectedSlots}
                                            lockedSlots={lockedSlots}
                                        />

                                        {/* Selection Summary */}
                                        {selectedSlots.length > 0 && (
                                            <div className="mt-4 p-3 sm:p-4 bg-primary-900 border-2 border-primary-600 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm sm:text-base text-gray-300">Selected Slots:</span>
                                                    <span className="font-bold text-white text-sm sm:text-base">{selectedSlots.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm sm:text-base text-gray-300">Total Amount:</span>
                                                    <span className="font-bold text-xl sm:text-2xl text-primary-400">
                                                        ₹{selectedSlots.reduce((sum, slot) => sum + slot.price, 0)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleProceedToBooking}
                                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base touch-target"
                                                >
                                                    Proceed to Book ({selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''})
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
                                <p className="text-xs text-gray-500 mb-2">Legend:</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                                        <span className="text-gray-400">Available</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded mr-2"></div>
                                        <span className="text-gray-400">Locked</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-orange-200 border-2 border-orange-400 rounded mr-2"></div>
                                        <span className="text-gray-400">Booked</span>
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

export default Home;
