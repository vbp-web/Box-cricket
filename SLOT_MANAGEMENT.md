# Admin Slot Management Feature

## Overview
Admins can now manually add or delete individual slots for any turf on any date. This provides fine-grained control over slot availability beyond the bulk slot generation feature.

## Features

### 1. **Add Individual Slots**
- Select a turf from the dropdown
- Choose a specific date
- Manually add slots with custom:
  - Start time
  - End time
  - Price (can differ from default turf price)

### 2. **Delete Slots**
- View all slots for a selected turf and date
- Delete available or locked slots
- **Protection**: Cannot delete booked slots

### 3. **Visual Slot Management**
- Color-coded slot status:
  - 🟢 **Green**: Available
  - 🟡 **Yellow**: Locked (temporarily reserved)
  - 🔴 **Red**: Booked
- Real-time slot grid display
- Operating hours reference for the selected turf

## Access

### Navigation Path
1. Login as admin
2. Go to Admin Dashboard
3. Click on "Manage Slots" card
4. Or directly navigate to `/admin/manage-slots`

## API Endpoints

### Create Slot
```
POST /api/slots
Headers: Authorization: Bearer <admin_token>
Body:
{
  "turfId": "string",
  "date": "YYYY-MM-DD",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "price": number
}
```

### Delete Slot
```
DELETE /api/slots/:id
Headers: Authorization: Bearer <admin_token>
```

## Usage Examples

### Example 1: Adding a Special Event Slot
If you want to add a special 3-hour slot for a tournament:
1. Select the turf
2. Select the event date
3. Click "Add New Slot"
4. Set start time: 09:00
5. Set end time: 12:00
6. Set price: 3500 (custom price for 3-hour slot)
7. Click "Add Slot"

### Example 2: Removing Maintenance Slots
If you need to block time for turf maintenance:
1. Select the turf
2. Select the maintenance date
3. Find the slots during maintenance hours
4. Click "Delete Slot" for each slot
5. Confirm deletion

## Validations

### Backend Validations
- ✅ Valid turf ID (MongoDB ObjectId)
- ✅ Turf must exist
- ✅ No duplicate slots (same turf, date, and start time)
- ✅ Cannot delete booked slots
- ✅ All required fields must be provided

### Frontend Validations
- ✅ All fields required in add slot form
- ✅ Date cannot be in the past
- ✅ Confirmation dialog before deletion
- ✅ Disabled delete button for booked slots

## User Interface

### Filters Section
- **Turf Selector**: Dropdown with all available turfs
- **Date Picker**: Calendar input with minimum date as today
- **Add Slot Button**: Opens modal for creating new slot
- **Info Panel**: Shows operating hours and default price

### Slots Grid
- **Card Layout**: Each slot displayed as a card
- **Slot Information**:
  - Time range (start - end)
  - Status badge
  - Price
  - Delete button
- **Empty State**: Helpful message when no slots exist

### Add Slot Modal
- **Clean Form**: Time inputs and price field
- **Smart Defaults**: Price placeholder shows turf's default price
- **Action Buttons**: Add and Cancel

## Technical Details

### Backend
- **Controller**: `slotController.js`
  - `createSlot()`: Creates individual slot
  - `deleteSlot()`: Deletes slot with validation
- **Routes**: `slot.js`
  - `POST /api/slots` (Admin only)
  - `DELETE /api/slots/:id` (Admin only)
- **Middleware**: Protected by `protect` and `admin` middleware

### Frontend
- **Component**: `AdminManageSlots.jsx`
- **State Management**: React hooks (useState, useEffect)
- **API Integration**: Axios via `api.js` utility
- **Routing**: Protected admin route in `App.jsx`

## Benefits

1. **Flexibility**: Add slots outside regular operating hours for special events
2. **Control**: Remove specific slots for maintenance or private bookings
3. **Pricing**: Set custom prices for individual slots
4. **Safety**: Cannot accidentally delete booked slots
5. **Convenience**: Visual interface better than bulk generation for small changes

## Future Enhancements

Potential improvements for future versions:
- Bulk delete multiple slots at once
- Copy slots from one date to another
- Recurring slot patterns (e.g., every Monday)
- Slot templates for common configurations
- Price adjustment for multiple slots
- Export slot schedule to CSV/PDF

## Troubleshooting

### "Slot already exists for this time"
- A slot with the same start time already exists for this turf and date
- Check the slots grid or choose a different time

### "Cannot delete a booked slot"
- The slot has been booked by a customer
- Contact the customer to cancel their booking first
- Or wait until the booking is completed

### "Failed to fetch slots"
- Check your internet connection
- Ensure the backend server is running
- Verify you're logged in as admin

## Related Features

- **Bulk Slot Generation**: Generate multiple slots at once for date ranges
- **Turf Management**: Edit turf details including operating hours
- **Booking Management**: View and manage all bookings

---

**Last Updated**: November 29, 2025
**Version**: 1.0.0
