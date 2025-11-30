
import React, { useState, useRef } from 'react';
import { Resource, Booking, User, ResourceType, BookingStatus } from '../types';
import BookingList from './BookingList';

interface StaffViewProps {
  staff: User;
  resources: Resource[];
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onConfirmCheckIn: (bookingId: string) => void;
  onConfirmCheckOut: (bookingId: string) => void;
  onDeclineRequest: (bookingId: string) => void;
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onDeleteResource: (resourceId: string) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
}

const StaffView: React.FC<StaffViewProps> = ({ 
  staff, 
  resources, 
  bookings, 
  onCancelBooking, 
  onConfirmCheckIn,
  onConfirmCheckOut,
  onDeclineRequest,
  onAddResource, 
  onDeleteResource, 
  currentDate,
  onDateChange
}) => {
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>(ResourceType.COMPUTER);
  const [newResourceDesc, setNewResourceDesc] = useState('');
  
  // State for delete confirmation
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // State for add confirmation
  const [resourceToAdd, setResourceToAdd] = useState<Omit<Resource, 'id'> | null>(null);
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  const activeBookings = bookings.filter(b => b.date === currentDate && b.status !== BookingStatus.CANCELLED);
  
  // Pending Requests (Check-In OR Check-Out)
  const pendingRequests = bookings.filter(b => 
    b.date === currentDate && 
    (b.status === BookingStatus.PENDING_CHECK_IN || b.status === BookingStatus.PENDING_CHECK_OUT)
  );

  const computerBookings = activeBookings.filter(b => {
    const r = resources.find(res => res.id === b.resourceId);
    return r?.type === ResourceType.COMPUTER;
  });

  const roomBookings = activeBookings.filter(b => {
    const r = resources.find(res => res.id === b.resourceId);
    return r?.type === ResourceType.COLLAB_ROOM;
  });

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResourceName.trim()) {
      // Trigger confirmation modal instead of adding directly
      setResourceToAdd({
        name: newResourceName,
        type: newResourceType,
        description: newResourceDesc || (newResourceType === ResourceType.COMPUTER ? 'Station' : 'Meeting Room'),
      });
    }
  };

  const handleConfirmAdd = () => {
    if (resourceToAdd) {
        onAddResource(resourceToAdd);
        // Clear form and modal state
        setResourceToAdd(null);
        setNewResourceName('');
        setNewResourceType(ResourceType.COMPUTER);
        setNewResourceDesc('');
    }
  };
  
  const handleConfirmDelete = () => {
    if (resourceToDelete) {
        onDeleteResource(resourceToDelete.id);
        setResourceToDelete(null);
    }
  };

  // Date Navigation
  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const handleDateClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (dateInputRef.current) {
        if ('showPicker' in HTMLInputElement.prototype) {
             try {
                dateInputRef.current.showPicker();
                return;
             } catch (e) {
                console.log(e);
             }
        }
        // Fallback
        dateInputRef.current.focus();
        dateInputRef.current.click();
    }
  };

  return (
    <div className="space-y-8 relative">
    
      {/* Delete Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                <div className="mb-4 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Resource?</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Are you sure you want to remove <span className="font-bold text-gray-800">"{resourceToDelete.name}"</span>?
                        This action cannot be undone.
                    </p>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={() => setResourceToDelete(null)}
                        className="flex-1 py-2 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmDelete}
                        className="flex-1 py-2 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Add Resource Confirmation Modal */}
      {resourceToAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                <div className="mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm New Resource</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">Please verify the details below.</p>
                    
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm space-y-3">
                        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                            <span className="text-gray-500">Name</span>
                            <span className="font-bold text-gray-800">{resourceToAdd.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                            <span className="text-gray-500">Type</span>
                            <span className="font-semibold text-gray-800">{resourceToAdd.type}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-gray-500">Description</span>
                            <span className="font-semibold text-gray-800">{resourceToAdd.description}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={() => setResourceToAdd(null)}
                        className="flex-1 py-2 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirmAdd}
                        className="flex-1 py-2 px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20"
                    >
                        Confirm Add
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-gray-200">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Oversee and manage library resources.</p>
        </div>
        
        {/* Updated Date Picker to Light Theme matching Student View */}
        <div className="mt-4 md:mt-0 flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-l-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <div className="relative group cursor-pointer" onClick={handleDateClick}>
                <input 
                    ref={dateInputRef}
                    type="date" 
                    value={currentDate} 
                    onChange={(e) => onDateChange(e.target.value)}
                    className="p-2 pl-8 text-center font-bold text-gray-800 outline-none border-x border-gray-100 bg-white cursor-pointer w-40"
                    onClick={() => {
                       if(dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
                           try { dateInputRef.current.showPicker(); } catch(err){}
                       }
                    }}
                />
                 <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-red-600">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                 </div>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-r-lg text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Check-in/Check-out Requests Section */}
          {pendingRequests.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 shadow-sm animate-fade-in">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Pending Requests ({pendingRequests.length})
                </h3>
                <BookingList 
                    bookings={pendingRequests}
                    resources={resources}
                    onCancel={onCancelBooking}
                    onConfirmCheckIn={onConfirmCheckIn}
                    onConfirmCheckOut={onConfirmCheckOut}
                    onRejectRequest={onDeclineRequest}
                    showCancelButton={false}
                    showUserName={true}
                />
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            Daily Bookings
            <span className="ml-2 bg-red-100 text-red-800 text-sm py-1 px-2 rounded-full">{activeBookings.length} Total</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Computers Column */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Computers ({computerBookings.length})</h4>
                  <BookingList
                    bookings={computerBookings}
                    resources={resources}
                    onCancel={onCancelBooking}
                    showCancelButton={true}
                    showUserName={true}
                  />
              </div>
              
              {/* Rooms Column */}
               <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Collaborative Rooms ({roomBookings.length})</h4>
                  <BookingList
                    bookings={roomBookings}
                    resources={resources}
                    onCancel={onCancelBooking}
                    showCancelButton={true}
                    showUserName={true}
                  />
              </div>
          </div>
        </div>

        {/* Resource Management Side Panel */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Manage Resources</h3>
            <form onSubmit={handleAddResourceSubmit} className="space-y-4 mb-8">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Add New Resource</h4>
              <input
                type="text"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
                placeholder="Resource Name (e.g., Computer 7)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50"
              />
              <select 
                value={newResourceType}
                onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50"
              >
                {Object.values(ResourceType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                value={newResourceDesc}
                onChange={(e) => setNewResourceDesc(e.target.value)}
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50"
              />
              <button type="submit" className="w-full bg-stone-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-stone-300 transition-colors">
                Add Resource
              </button>
            </form>
          </div>
          
          <div className="pt-2">
             <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Existing Resources ({resources.length})</h4>
             <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {resources.map(resource => (
                    <li key={resource.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-red-200 transition-colors">
                        <div>
                             <span className="block text-sm font-semibold text-gray-800">{resource.name}</span>
                             <span className="text-xs text-gray-500">{resource.type}</span>
                        </div>
                        <button onClick={() => setResourceToDelete(resource)} className="text-red-500 hover:text-red-700 font-bold text-xs tracking-wider">DELETE</button>
                    </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffView;
