import { Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee } from 'lucide-react';

const TurfCard = ({ turf }) => {
    return (
        <div className="card group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={turf.images[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={turf.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <span className="badge badge-success">
                        {turf.isActive ? 'Available' : 'Closed'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{turf.name}</h3>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{turf.location.address}, {turf.location.city}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {turf.description}
                </p>

                {/* Rating & Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="font-semibold">{turf.rating}</span>
                        <span className="text-gray-500 text-sm">({turf.totalReviews})</span>
                    </div>
                    <div className="flex items-center text-primary-600 font-bold text-lg">
                        <IndianRupee size={18} />
                        <span>{turf.pricePerHour}/hr</span>
                    </div>
                </div>

                {/* Facilities */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {turf.facilities.slice(0, 3).map((facility, index) => (
                        <span key={index} className="badge badge-info text-xs">
                            {facility}
                        </span>
                    ))}
                    {turf.facilities.length > 3 && (
                        <span className="badge badge-info text-xs">
                            +{turf.facilities.length - 3} more
                        </span>
                    )}
                </div>

                {/* Book Now Button */}
                <Link to={`/turf/${turf._id}`} className="btn-primary w-full text-center">
                    Book Now
                </Link>
            </div>
        </div>
    );
};

export default TurfCard;
