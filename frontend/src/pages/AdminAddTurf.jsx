import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminAddTurf = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: 'Kalol',
        state: 'Gujarat',
        pincode: '',
        pricePerHour: '',
        turfType: 'Artificial Grass',
        length: '',
        width: '',
        capacity: '22',
        openTime: '06:00',
        closeTime: '23:00',
        facilities: [],
    });
    const [images, setImages] = useState([]);

    const facilityOptions = [
        'Parking',
        'Washroom',
        'Changing Room',
        'Drinking Water',
        'First Aid',
        'Seating Area',
        'Lighting',
        'Scoreboard',
        'Equipment Rental',
    ];

    useEffect(() => {
        if (isEdit) {
            fetchTurfDetails();
        }
    }, [id]);

    const fetchTurfDetails = async () => {
        try {
            const response = await api.get(`/turfs/${id}`);
            const turf = response.data.data.turf;

            setFormData({
                name: turf.name,
                description: turf.description,
                address: turf.location.address,
                city: turf.location.city,
                state: turf.location.state,
                pincode: turf.location.pincode || '',
                pricePerHour: turf.pricePerHour,
                turfType: turf.turfType,
                length: turf.dimensions?.length || '',
                width: turf.dimensions?.width || '',
                capacity: turf.capacity,
                openTime: turf.operatingHours.open,
                closeTime: turf.operatingHours.close,
                facilities: turf.facilities,
            });
        } catch (error) {
            toast.error('Failed to fetch turf details');
            navigate('/admin/dashboard');
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleFacility = (facility) => {
        setFormData((prev) => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter((f) => f !== facility)
                : [...prev.facilities, facility],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                pricePerHour: Number(formData.pricePerHour),
                facilities: formData.facilities,
                turfType: formData.turfType,
                dimensions: {
                    length: Number(formData.length),
                    width: Number(formData.width),
                    unit: 'feet',
                },
                capacity: Number(formData.capacity),
                operatingHours: {
                    open: formData.openTime,
                    close: formData.closeTime,
                },
                images: images,
            };

            if (isEdit) {
                await api.put(`/turfs/${id}`, payload);
                toast.success('Turf updated successfully');
            } else {
                await api.post('/turfs', payload);
                toast.success('Turf created successfully');
            }

            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save turf');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-6">
                        {isEdit ? 'Edit Turf' : 'Add New Turf'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Turf Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="Champions Cricket Arena"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        placeholder="Describe your turf..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input-field"
                                        placeholder="Near GIDC Circle"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        pattern="[0-9]{6}"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className="input-field"
                                        placeholder="382721"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Turf Details */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Turf Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price per Hour (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.pricePerHour}
                                        onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                        className="input-field"
                                        placeholder="1200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Turf Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.turfType}
                                        onChange={(e) => setFormData({ ...formData, turfType: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Artificial Grass">Artificial Grass</option>
                                        <option value="Natural Grass">Natural Grass</option>
                                        <option value="Concrete">Concrete</option>
                                        <option value="Matting">Matting</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Length (feet) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.length}
                                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                        className="input-field"
                                        placeholder="120"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Width (feet) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="input-field"
                                        placeholder="80"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacity (players) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="input-field"
                                        placeholder="22"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Operating Hours */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Operating Hours</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Opening Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.openTime}
                                        onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Closing Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.closeTime}
                                        onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Facilities */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Facilities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {facilityOptions.map((facility) => (
                                    <label
                                        key={facility}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities.includes(facility)}
                                            onChange={() => toggleFacility(facility)}
                                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Images</h2>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center cursor-pointer"
                                >
                                    <Upload size={48} className="text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload images</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                                </label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1"
                            >
                                {loading ? 'Saving...' : isEdit ? 'Update Turf' : 'Create Turf'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAddTurf;
