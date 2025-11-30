
import React, { useState, useRef } from 'react';
import { Resource, Booking, User, ResourceType, BookingStatus } from '../types';
import ResourceCard from './ResourceCard';
import BookingList from './BookingList';
import { ComputerIcon, RoomIcon } from './icons/ResourceIcons';

interface StudentViewProps {
  student: User;
  resources: Resource[];
  bookings: Booking[];
  onBook: (resourceId: string, timeSlot: string) => boolean;
  onCancel: (bookingId: string) => void;
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ 
  student, 
  resources, 
  bookings, 
  onBook, 
  onCancel, 
  onCheckIn, 
  onCheckOut,
  currentDate, 
  onDateChange 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | 'ALL'>('ALL');
  
  // State for Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{resource: Resource, slot: string} | null>(null);
  
  // State for Success Notification
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Show all history for the selected date, including Cancelled and No Show (History Log)
  const myBookings = bookings.filter(b => 
    b.userId === student.id && 
    b.date === currentDate
  );
  
  const filteredResources = resources.filter(r => selectedCategory === 'ALL' || r.type === selectedCategory);

  const computers = resources.filter(r => r.type === ResourceType.COMPUTER);
  const rooms = resources.filter(r => r.type === ResourceType.COLLAB_ROOM);

  const handleDateClick = (e?: React.MouseEvent) => {
    // Stop propagation if clicked on the button to prevents double-firing if nested
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (dateInputRef.current) {
        // Try the modern API first
        if ('showPicker' in HTMLInputElement.prototype) {
            try {
                dateInputRef.current.showPicker();
                return;
            } catch (error) {
                console.log("showPicker failed, falling back", error);
            }
        } 
        // Fallback for browsers that don't support showPicker or if it failed
        dateInputRef.current.focus();
        dateInputRef.current.click();
    }
  };

  const handleInitiateBooking = (resourceId: string, timeSlot: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
        setConfirmModal({ resource, slot: timeSlot });
    }
    return false; // Don't book yet, wait for confirmation
  };

  const handleConfirmBooking = () => {
    if (confirmModal) {
        const success = onBook(confirmModal.resource.id, confirmModal.slot);
        if (success) {
            setSuccessMsg(`Successfully booked ${confirmModal.resource.name} for ${confirmModal.slot}`);
            setTimeout(() => setSuccessMsg(null), 3000); // Hide after 3 seconds
        }
        setConfirmModal(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 relative">
      
      {/* Success Notification Toast - MOVED TO TOP CENTER */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-[100] flex items-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
                <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
                    <p className="text-gray-600 text-sm mb-1">Resource:</p>
                    <p className="font-bold text-gray-800 text-lg mb-3">{confirmModal.resource.name}</p>
                    <p className="text-gray-600 text-sm mb-1">Time:</p>
                    <p className="font-bold text-red-700 text-lg">{confirmModal.slot}</p>
                    <p className="text-gray-600 text-sm mt-3 pt-3 border-t border-red-200">Date: <span className="font-semibold">{new Date(currentDate).toDateString()}</span></p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex gap-2 items-start">
                   <span className="text-yellow-600 font-bold">⚠️</span>
                   <p className="text-xs text-yellow-800 leading-relaxed">
                     Policy: You must check-in within <strong>15 minutes</strong> of your selected time slot to avoid a NO_SHOW status.
                   </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setConfirmModal(null)}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmBooking}
                        className="flex-1 py-3 px-4 rounded-xl bg-red-800 text-white font-bold hover:bg-red-900 transition-colors shadow-lg shadow-red-900/20"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-white border-b border-gray-100 p-6 rounded-t-lg shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome {student.name.split(' ')[0]}!</h2>
        <p className="text-gray-500">Book a resource for your study session.</p>
      </div>

      {/* Date Bar - Improved Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center gap-4">
           <label className="font-bold text-gray-800 text-lg min-w-fit">Date:</label>
           <div className="relative w-full max-w-xs group">
                <input 
                    ref={dateInputRef}
                    type="date" 
                    value={currentDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    onClick={() => {
                       // Trigger picker on direct input click as well
                       if(dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
                           try { dateInputRef.current.showPicker(); } catch(err){}
                       }
                    }}
                    className="w-full p-3 pl-4 pr-16 border-2 border-red-100 rounded-lg text-gray-900 font-bold text-lg bg-red-50/50 group-hover:bg-white group-hover:border-red-400 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all cursor-pointer shadow-sm"
                />
                <div className="absolute right-1 top-1 bottom-1">
                    <button 
                        onClick={handleDateClick}
                        className="h-full px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center active:scale-95"
                        aria-label="Open Calendar"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    </button>
                </div>
           </div>
      </div>

      {/* My Bookings Section */}
      {myBookings.length > 0 && (
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
          <h3 className="text-xl font-bold mb-4 text-red-900 flex items-center gap-2">
            <span className="bg-red-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">!</span>
            My Bookings for {new Date(currentDate).toLocaleDateString()}
          </h3>
          <BookingList
            bookings={myBookings}
            resources={resources}
            onCancel={onCancel}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            showCancelButton={true}
            showCheckInButton={true}
          />
        </div>
      )}

      {/* Resource Category Selection */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-2 mt-8 mb-6 gap-2">
            <h3 className="text-2xl font-semibold text-gray-800">Available Resources</h3>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                Policy: Bookings auto-cancel if not checked in within 15 mins of start time.
            </span>
        </div>
        
        {selectedCategory === 'ALL' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <button 
                    onClick={() => setSelectedCategory(ResourceType.COMPUTER)}
                    className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
                >
                    <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-red-50 transition-colors">
                        <ComputerIcon className="w-20 h-20 text-gray-700 group-hover:text-red-700 transition-colors" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800 group-hover:text-red-800">Computers ({computers.length})</span>
                    <span className="text-gray-500 mt-2">Single station PCs</span>
                </button>

                <button 
                    onClick={() => setSelectedCategory(ResourceType.COLLAB_ROOM)}
                    className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
                >
                    <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-red-50 transition-colors">
                        <RoomIcon className="w-20 h-20 text-gray-700 group-hover:text-red-700 transition-colors" />
                    </div>
                    <span className="text-2xl font-bold text-gray-800 group-hover:text-red-800">Collaborative Rooms ({rooms.length})</span>
                    <span className="text-gray-500 mt-2">Group study spaces</span>
                </button>
             </div>
        ) : (
            <div>
                 <button 
                    onClick={() => setSelectedCategory('ALL')}
                    className="mb-6 flex items-center gap-2 text-red-700 font-bold hover:underline bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
                >
                    <span>←</span> Back to Categories
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard
                        key={resource.id}
                        resource={resource}
                        date={currentDate}
                        // Filter out Cancelled/NoShow from bookings passed to Available view
                        bookings={bookings.filter(b => b.resourceId === resource.id && b.date === currentDate && b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.NO_SHOW)}
                        // Filter out Cancelled/NoShow from current user bookings so they don't see "My Booking" on cancelled slots and can re-book
                        currentUserBookings={myBookings.filter(b => b.resourceId === resource.id && b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.NO_SHOW)}
                        onBook={handleInitiateBooking}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentView;
