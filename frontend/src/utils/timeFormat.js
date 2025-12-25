/**
 * Format time from 24-hour format to 12-hour format with AM/PM
 * @param {string} time - Time in HH:MM format (e.g., "14:00")
 * @returns {string} - Time in 12-hour format (e.g., "2:00 PM")
 */
export const formatTime = (time) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Format time range
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {string} - Formatted time range (e.g., "2:00 PM - 3:00 PM")
 */
export const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Get short time format (without minutes if :00)
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Short time format (e.g., "2 PM" or "2:30 PM")
 */
export const formatTimeShort = (time) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    // Only show minutes if not :00
    if (minutes === 0) {
        return `${displayHours} ${period}`;
    }

    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};
