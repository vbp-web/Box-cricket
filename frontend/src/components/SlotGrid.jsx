import { Clock, Lock, Check } from 'lucide-react';
import { formatTimeShort } from '../utils/timeFormat';

const SlotGrid = ({ slots, onSlotSelect, selectedSlots = [], lockedSlots = [] }) => {
    const getSlotStatus = (slot) => {
        if (slot.status === 'booked') return 'booked';
        if (slot.status === 'locked') return 'locked';
        if (lockedSlots.includes(slot._id)) return 'locked';
        return 'available';
    };

    const isSlotSelected = (slot) => {
        return selectedSlots.some(s => s._id === slot._id);
    };

    const getSlotClass = (slot) => {
        const status = getSlotStatus(slot);
        const isSelected = isSlotSelected(slot);

        if (isSelected) {
            return 'bg-primary-600 text-white border-primary-600 cursor-pointer ring-2 ring-primary-400';
        }

        switch (status) {
            case 'booked':
                return 'bg-orange-900/30 text-orange-300 cursor-not-allowed border-orange-600';
            case 'locked':
                return 'bg-yellow-900 text-yellow-300 cursor-not-allowed border-yellow-700';
            default:
                return 'bg-gray-800 text-gray-200 hover:bg-primary-900 hover:border-primary-500 cursor-pointer border-gray-600';
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {slots.map((slot) => {
                const status = getSlotStatus(slot);
                const isDisabled = status === 'booked' || status === 'locked';
                const isSelected = isSlotSelected(slot);

                return (
                    <button
                        key={slot._id}
                        onClick={() => !isDisabled && onSlotSelect(slot)}
                        disabled={isDisabled}
                        className={`relative flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 min-h-[110px] sm:min-h-[120px] ${getSlotClass(slot)}`}
                    >
                        {/* Selected Checkmark */}
                        {isSelected && (
                            <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                                <Check size={14} className="sm:w-4 sm:h-4 text-primary-600" />
                            </div>
                        )}

                        {/* Time Display */}
                        <div className="flex flex-col items-center justify-center gap-0.5">
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} className="sm:w-5 sm:h-5 flex-shrink-0 opacity-70" />
                                <span className="font-bold text-base sm:text-lg leading-none">
                                    {formatTimeShort(slot.startTime)}
                                </span>
                            </div>
                            <div className="text-[10px] sm:text-xs opacity-60 font-medium">
                                to {formatTimeShort(slot.endTime)}
                            </div>
                        </div>

                        {/* Price Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-500/10 text-primary-400'
                            }`}>
                            ₹{slot.price}
                        </div>

                        {/* Locked Icon */}
                        {status === 'locked' && (
                            <div className="absolute bottom-2 flex items-center justify-center">
                                <Lock size={14} className="sm:w-4 sm:h-4 opacity-70" />
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default SlotGrid;
