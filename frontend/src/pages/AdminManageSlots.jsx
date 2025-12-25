import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Clock, DollarSign, Filter } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatTimeShort } from '../utils/timeFormat';

const AdminManageSlots = () => {
    const navigate = useNavigate();
    const [turfs, setTurfs] = useState([]);
    const [selectedTurf, setSelectedTurf] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSlot, setNewSlot] = useState({
        startTime: '',
        endTime: '',
        price: '',
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
            setSlots(response.data.data.slots);
        } catch (error) {
            toast.error('Failed to fetch slots');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();

        if (!newSlot.startTime || !newSlot.endTime || !newSlot.price) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            await api.post('/slots', {
                turfId: selectedTurf,
                date: selectedDate,
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                price: Number(newSlot.price),
            });

            toast.success(`Slot added: ${formatTimeShort(newSlot.startTime)} - ${formatTimeShort(newSlot.endTime)}`);
            setShowAddModal(false);
            setNewSlot({ startTime: '', endTime: '', price: '' });
            fetchSlots();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add slot');
        }
    };

    const handleDeleteSlot = async (slotId, slotStatus) => {
        if (slotStatus === 'booked') {
            toast.error('Cannot delete a booked slot');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this slot?')) {
            return;
        }

        try {
            await api.delete(`/slots/${slotId}`);
            toast.success('Slot deleted successfully');
            fetchSlots();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete slot');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'locked':
                return 'bg-yellow-100 text-yellow-800';
            case 'booked':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const selectedTurfData = turfs.find(t => t._id === selectedTurf);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Slots</h1>
                        <p className="text-gray-600 mt-2">Add or remove time slots for your turfs</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="btn-secondary"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-600" />
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Turf
                            </label>
                            <select
                                value={selectedTurf}
                                onChange={(e) => setSelectedTurf(e.target.value)}
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
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add New Slot
                            </button>
                        </div>
                    </div>

                    {selectedTurfData && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Operating Hours:</strong> {formatTimeShort(selectedTurfData.operatingHours.open)} - {formatTimeShort(selectedTurfData.operatingHours.close)}
                                <span className="ml-4">
                                    <strong>Default Price:</strong> ₹{selectedTurfData.pricePerHour}/hour
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Slots Grid */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">
                        Slots for {new Date(selectedDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">No slots available for this date</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary mt-4"
                            >
                                Add First Slot
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {slots.map((slot) => (
                                <div
                                    key={slot._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-gray-600" />
                                            <span className="font-semibold text-gray-900">
                                                {formatTimeShort(slot.startTime)} - {formatTimeShort(slot.endTime)}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.status)}`}>
                                            {slot.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <DollarSign size={18} className="text-green-600" />
                                        <span className="text-lg font-bold text-green-600">
                                            ₹{slot.price}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteSlot(slot._id, slot.status)}
                                        disabled={slot.status === 'booked'}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${slot.status === 'booked'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        <Trash2 size={16} />
                                        {slot.status === 'booked' ? 'Cannot Delete' : 'Delete Slot'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Slot Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Add New Slot</h2>
                        <form onSubmit={handleAddSlot} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={newSlot.startTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                    className="input-field"
                                />
                                {newSlot.startTime && (
                                    <p className="text-sm text-primary-600 mt-1 font-medium">
                                        {formatTimeShort(newSlot.startTime)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={newSlot.endTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                    className="input-field"
                                />
                                {newSlot.endTime && (
                                    <p className="text-sm text-primary-600 mt-1 font-medium">
                                        {formatTimeShort(newSlot.endTime)}
                                    </p>
                                )}
                            </div>

                            {/* Preview of the slot */}
                            {newSlot.startTime && newSlot.endTime && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800 font-medium">
                                        📅 Slot Preview: {formatTimeShort(newSlot.startTime)} - {formatTimeShort(newSlot.endTime)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newSlot.price}
                                    onChange={(e) => setNewSlot({ ...newSlot, price: e.target.value })}
                                    className="input-field"
                                    placeholder={selectedTurfData?.pricePerHour || '1200'}
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                >
                                    Add Slot
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewSlot({ startTime: '', endTime: '', price: '' });
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManageSlots;
