
import React, { useState } from 'react';
import { Resource, Booking, ResourceType } from '../types';
import { TIME_SLOTS } from '../constants';
import { ComputerIcon, RoomIcon } from './icons/ResourceIcons';

interface ResourceCardProps {
  resource: Resource;
  bookings: Booking[];
  currentUserBookings: Booking[];
  onBook: (resourceId: string, timeSlot: string) => boolean;
  date: string;
}

const ResourceTypeIcon: React.FC<{ type: ResourceType, className?: string }> = ({ type, className = "h-6 w-6" }) => {
  switch (type) {
    case ResourceType.COMPUTER: return <ComputerIcon className={className} />;
    case ResourceType.COLLAB_ROOM: return <RoomIcon className={className} />;
    default: return null;
  }
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, bookings, currentUserBookings, onBook, date }) => {
  const bookedSlots = new Set(bookings.map(b => b.timeSlot));
  const myBookedSlots = new Set(currentUserBookings.map(b => b.timeSlot));

  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleBookClick = (timeSlot: string) => {
    const success = onBook(resource.id, timeSlot);
    if(success) {
      setShowSuccess(timeSlot);
      setTimeout(() => setShowSuccess(null), 2000);
    } else {
        // Fallback alert if logic fails (e.g. race condition)
        alert("Unable to book this slot.");
    }
  };

  // Helper to check if slot is past
  const isSlotPast = (timeSlot: string) => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      if (date < todayStr) return true;
      if (date > todayStr) return false;

      // Same day comparison
      const [startTimeStr] = timeSlot.split(' - ');
      const [time, modifier] = startTimeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const slotStartTime = new Date();
      slotStartTime.setHours(hours, minutes, 0, 0);

      // Strict check: If current time is greater than slot start time, it's unavailable for booking.
      // NOTE: This prevents late booking. Check-in logic handles existing bookings separately.
      return now > slotStartTime;
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-800">{resource.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{resource.description}</p>
            </div>
            <div className="p-2 bg-stone-100 rounded-lg text-gray-600">
                <ResourceTypeIcon type={resource.type} className="h-6 w-6" />
            </div>
        </div>
      </div>
      <div className="p-4 bg-stone-50 flex-grow">
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map(slot => {
            const isBooked = bookedSlots.has(slot);
            const isMyBooking = myBookedSlots.has(slot);
            const isSuccess = showSuccess === slot;
            const isPast = isSlotPast(slot);
            
            const isOccupied = isBooked && !isMyBooking;
            
            // Unavailable logic: Past and not booked by anyone (if it was booked, it shows as Booked/Occupied)
            // If it is past and NOT my booking and NOT occupied, it is Unavailable (cannot be booked late).
            const isUnavailable = isPast && !isBooked && !isMyBooking;

            let buttonClass = "w-full text-xs py-2 px-1 rounded-md transition-all duration-200 font-medium ";
            let buttonText = slot;
            
            if (isMyBooking) {
              buttonClass += "bg-red-700 text-white border border-red-800 shadow-inner";
              buttonText = "My Booking";
            } else if (isOccupied) {
              // Occupied by someone else
              buttonClass += "bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200";
              buttonText = "Occupied";
            } else if(isSuccess) {
              buttonClass += "bg-green-600 text-white ring-2 ring-green-600 ring-offset-1";
              buttonText = "Confirmed!";
            } else if (isUnavailable) {
              buttonClass += "bg-gray-100 text-gray-300 cursor-not-allowed border-transparent";
              buttonText = "Unavailable";
            } else {
              // Available
              buttonClass += "bg-white text-gray-700 border border-gray-300 hover:border-red-500 hover:text-red-600 hover:shadow-sm";
            }

            return (
              <button
                key={slot}
                disabled={isBooked || isUnavailable || isOccupied || isMyBooking}
                onClick={() => !isBooked && !isUnavailable && !isMyBooking && handleBookClick(slot)}
                className={buttonClass}
                title={isOccupied ? "This slot is already booked" : isUnavailable ? "This time slot has passed" : "Click to book"}
              >
                {buttonText}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
