
import React from 'react';
import { Booking, Resource, User, UserRole, ResourceType, BookingStatus } from '../types';
import { MOCK_USERS } from '../constants';
import { ComputerIcon, RoomIcon } from './icons/ResourceIcons';

interface BookingListProps {
  bookings: Booking[];
  resources: Resource[];
  onCancel: (bookingId: string) => void;
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
  onConfirmCheckIn?: (bookingId: string) => void; // For staff to confirm check in
  onConfirmCheckOut?: (bookingId: string) => void; // For staff to confirm check out
  onRejectRequest?: (bookingId: string) => void; // For staff to reject a request but keep booking
  showCancelButton: boolean;
  showCheckInButton?: boolean;
  showUserName?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  resources, 
  onCancel, 
  onCheckIn,
  onCheckOut,
  onConfirmCheckIn,
  onConfirmCheckOut,
  onRejectRequest,
  showCancelButton, 
  showCheckInButton = false,
  showUserName = false 
}) => {
  const resourceMap = new Map<string, Resource>(resources.map(r => [r.id, r]));

  if (bookings.length === 0) {
    return (
        <div className="text-center py-6 bg-white/50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No bookings found.</p>
        </div>
    );
  }
  
  const sortedBookings = [...bookings].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  return (
    <div className="space-y-3">
      {sortedBookings.map(booking => {
        const resource = resourceMap.get(booking.resourceId);
        if (!resource) return null;

        const user = Object.values(MOCK_USERS).find(u => u.id === booking.userId);

        const canCheckIn = booking.status === BookingStatus.CONFIRMED;
        const canCheckOut = booking.status === BookingStatus.CHECKED_IN;
        const isPendingCheckIn = booking.status === BookingStatus.PENDING_CHECK_IN;
        const isPendingCheckOut = booking.status === BookingStatus.PENDING_CHECK_OUT;
        const isCompleted = booking.status === BookingStatus.COMPLETED;
        const isCancelled = booking.status === BookingStatus.CANCELLED;
        const isNoShow = booking.status === BookingStatus.NO_SHOW;

        // Determine card style based on status
        let cardStyle = "border-gray-200";
        let statusStyle = "";
        
        if (isPendingCheckIn || isPendingCheckOut) {
            if (onConfirmCheckIn || onConfirmCheckOut) { // Staff view pending
                 cardStyle = "border-yellow-300 bg-yellow-50";
            }
        } else if (isCompleted) {
            cardStyle = "border-gray-100 bg-gray-50 opacity-80";
        } else if (isCancelled || isNoShow) {
            // History Log Style
            cardStyle = "border-gray-100 bg-gray-50/50 opacity-70 grayscale-[0.8]";
        }

        return (
          <div key={booking.id} className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${cardStyle}`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-stone-100 text-stone-600 rounded-full border border-stone-200">
                {resource.type === ResourceType.COMPUTER && <ComputerIcon className="h-5 w-5" />}
                {resource.type === ResourceType.COLLAB_ROOM && <RoomIcon className="h-5 w-5" />}
              </div>
              <div>
                <p className={`font-bold text-gray-800 ${(isCancelled || isNoShow) ? 'line-through text-gray-400' : ''}`}>{resource.name}</p>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded ${(isCancelled || isNoShow) ? 'line-through opacity-50' : ''}`}>{booking.timeSlot}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        booking.status === BookingStatus.CHECKED_IN ? 'bg-green-100 text-green-700' :
                        booking.status === BookingStatus.NO_SHOW ? 'bg-red-50 text-red-500 border border-red-100' :
                        booking.status === BookingStatus.CANCELLED ? 'bg-stone-100 text-stone-500 border border-stone-200' :
                        booking.status === BookingStatus.PENDING_CHECK_IN || booking.status === BookingStatus.PENDING_CHECK_OUT ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === BookingStatus.COMPLETED ? 'bg-gray-200 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {booking.status}
                    </span>
                </div>
                 {showUserName && user && (
                    <p className="text-xs text-gray-500 pt-1">Booked by: <span className="font-semibold text-gray-700">{user.name}</span></p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              
              {/* STAFF VIEW ACTIONS */}
              
              {/* Confirm Check-In Button */}
              {onConfirmCheckIn && isPendingCheckIn && (
                  <button
                    onClick={() => onConfirmCheckIn(booking.id)}
                    className="bg-green-600 text-white font-bold py-1.5 px-4 text-xs rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-1 animate-pulse"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Confirm
                  </button>
              )}

              {/* Reject Check-In Button - NEW */}
              {onRejectRequest && isPendingCheckIn && (
                  <button
                    onClick={() => onRejectRequest(booking.id)}
                    className="bg-white text-yellow-700 border border-yellow-400 font-bold py-1.5 px-4 text-xs rounded-lg hover:bg-yellow-50 transition-colors shadow-sm ml-2"
                  >
                    Decline
                  </button>
              )}

              {/* Confirm Check-Out Button */}
              {onConfirmCheckOut && isPendingCheckOut && (
                  <button
                    onClick={() => onConfirmCheckOut(booking.id)}
                    className="bg-blue-600 text-white font-bold py-1.5 px-4 text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-1 animate-pulse"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Confirm Check-out
                  </button>
              )}

              {/* Reject Check-Out Button - NEW */}
              {onRejectRequest && isPendingCheckOut && (
                  <button
                    onClick={() => onRejectRequest(booking.id)}
                    className="bg-white text-yellow-700 border border-yellow-400 font-bold py-1.5 px-4 text-xs rounded-lg hover:bg-yellow-50 transition-colors shadow-sm ml-2"
                  >
                    Decline
                  </button>
              )}


              {/* STUDENT VIEW ACTIONS */}

              {/* Check In Button */}
              {showCheckInButton && onCheckIn && canCheckIn && (
                  <button
                    onClick={() => onCheckIn(booking.id)}
                    className="bg-green-600 text-white font-semibold py-1.5 px-4 text-xs rounded-full hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Check In
                  </button>
              )}

              {/* Check Out Button */}
              {showCheckInButton && onCheckOut && canCheckOut && (
                  <button
                    onClick={() => onCheckOut(booking.id)}
                    className="bg-blue-600 text-white font-semibold py-1.5 px-4 text-xs rounded-full hover:bg-blue-700 transition-colors shadow-sm border border-blue-700"
                  >
                    Check Out
                  </button>
              )}

              {/* Pending Message */}
              {showCheckInButton && (isPendingCheckIn || isPendingCheckOut) && (
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1.5 rounded-full border border-yellow-200">
                      Waiting for Approval
                  </span>
              )}

              {/* Cancel Button - Only for future/confirmed bookings */}
              {showCancelButton && booking.status === BookingStatus.CONFIRMED && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="bg-white text-gray-500 border border-gray-300 font-semibold py-1.5 px-4 text-xs rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
