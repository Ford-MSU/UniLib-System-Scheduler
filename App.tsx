
import React, { useState, useCallback, useEffect } from 'react';
import { MOCK_RESOURCES, MOCK_USERS, MOCK_BOOKINGS } from './constants';
import { Resource, Booking, User, UserRole, BookingStatus } from './types';
import Header from './components/Header';
import StudentView from './components/StudentView';
import StaffView from './components/StaffView';
import LoginView from './components/LoginView';
import PortalView from './components/PortalView';

type ViewState = 'LOGIN' | 'PORTAL' | 'APP';

// Helper to parse time slot string into a Date object for a specific day
const getSlotDate = (dateStr: string, timeSlot: string): Date => {
  const [startTimeStr] = timeSlot.split(' - ');
  const [time, modifier] = startTimeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[UserRole.STUDENT]);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  // Start with a date, default to today
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 15-Minute Rule Check (Auto No-Show)
  useEffect(() => {
    const checkLateBookings = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      setBookings(prevBookings => 
        prevBookings.map(booking => {
          // Only check confirmed bookings. 
          // If status is PENDING_CHECK_IN, the student is present/waiting, so DO NOT mark as No Show.
          if (booking.status !== BookingStatus.CONFIRMED) return booking;

          // Only apply to bookings for today or past dates
          if (booking.date > todayStr) return booking;

          try {
            const bookingStart = getSlotDate(booking.date, booking.timeSlot);
            
            // Determine 15 minute buffer (Grace Period)
            // The limit starts when the selected Date and Time Slot aligns with the real Date and Time.
            const lateThreshold = new Date(bookingStart.getTime() + 15 * 60000);

            // If current time is past the threshold and user hasn't checked in, mark as NO_SHOW
            if (now > lateThreshold) {
               console.log(`Booking ${booking.id} marked as NO_SHOW due to lateness.`);
               return { ...booking, status: BookingStatus.NO_SHOW };
            }
          } catch (e) {
            console.error("Error parsing time for booking", booking.id);
          }

          return booking;
        })
      );
    };

    // Run immediately and then every minute
    checkLateBookings();
    const interval = setInterval(checkLateBookings, 60000);
    return () => clearInterval(interval);
  }, []);


  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
  };

  const handleAddBooking = useCallback((resourceId: string, timeSlot: string): boolean => {
    // 1. Check if the slot is already taken by ANYONE (excluding Cancelled/NoShow)
    const isSlotTaken = bookings.some(b => 
        b.resourceId === resourceId && 
        b.date === selectedDate && 
        b.timeSlot === timeSlot &&
        b.status !== BookingStatus.CANCELLED &&
        b.status !== BookingStatus.NO_SHOW
    );

    if (isSlotTaken) {
        return false;
    }

    // 2. Prevent overlapping bookings: Student can only occupy 1 resource AT A TIME.
    // Check if the current user already has an active booking for this specific time slot.
    const hasConcurrentBooking = bookings.some(b => 
      b.userId === currentUser.id &&
      b.date === selectedDate &&
      b.timeSlot === timeSlot &&
      (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.CHECKED_IN || b.status === BookingStatus.PENDING_CHECK_IN || b.status === BookingStatus.PENDING_CHECK_OUT)
    );

    if (hasConcurrentBooking && currentUser.role === UserRole.STUDENT) {
      alert("You already have a booking for this time slot. You can only occupy one resource at a time.");
      return false;
    }

    // 3. Prevent student from booking more than 2 slots per day total (excluding cancelled/no-show)
    const studentBookingsToday = bookings.filter(b => 
      b.userId === currentUser.id && 
      b.date === selectedDate && 
      (b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.NO_SHOW)
    ).length;

    if (currentUser.role === UserRole.STUDENT && studentBookingsToday >= 2) {
      alert("You have reached the maximum of 2 bookings for today.");
      return false;
    }

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      resourceId,
      userId: currentUser.id,
      timeSlot,
      date: selectedDate,
      status: BookingStatus.CONFIRMED
    };
    setBookings(prevBookings => [...prevBookings, newBooking]);
    return true;
  }, [bookings, currentUser, selectedDate]);

  const handleCancelBooking = useCallback((bookingId: string) => {
    // Keep the booking object but change status to CANCELLED (History Log)
    setBookings(prevBookings => prevBookings.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.CANCELLED } : b
    )); 
  }, []);

  // Student requests check-in
  const handleCheckInRequest = useCallback((bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // 1. Check Date Alignment
    if (booking.date !== todayStr) {
      alert("You can only check-in on the scheduled date of your booking.");
      return;
    }

    try {
      // 2. Check Time Alignment with Real Time
      const bookingStart = getSlotDate(booking.date, booking.timeSlot);
      
      // Allow check-in 15 minutes before start
      const checkInStartWindow = new Date(bookingStart.getTime() - 15 * 60000);
      // Close check-in 15 minutes after start (Grace Period)
      const checkInEndWindow = new Date(bookingStart.getTime() + 15 * 60000);

      if (now < checkInStartWindow) {
        alert(`It is too early to check in. Check-in becomes available at ${checkInStartWindow.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (15 mins before).`);
        return;
      }

      if (now > checkInEndWindow) {
        alert("You are too late. The 15-minute grace period for check-in has expired. Your booking is marked as No Show.");
        // Immediately mark as No Show to reflect reality
        setBookings(prevBookings => prevBookings.map(b => 
          b.id === bookingId ? { ...b, status: BookingStatus.NO_SHOW } : b
        ));
        return;
      }

      // If checks pass, proceed
      setBookings(prevBookings => prevBookings.map(b => 
        b.id === bookingId ? { ...b, status: BookingStatus.PENDING_CHECK_IN } : b
      ));

    } catch (e) {
      console.error("Time validation error", e);
      alert("System error validating time.");
    }
  }, [bookings]);

  // Student requests check-out
  const handleCheckOutRequest = useCallback((bookingId: string) => {
    setBookings(prevBookings => prevBookings.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.PENDING_CHECK_OUT } : b
    ));
  }, []);

  // Staff confirms check-in
  const handleConfirmCheckIn = useCallback((bookingId: string) => {
    setBookings(prevBookings => prevBookings.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.CHECKED_IN } : b
    ));
  }, []);

  // Staff declines request
  const handleDeclineRequest = useCallback((bookingId: string) => {
    setBookings(prevBookings => prevBookings.map(b => {
      if (b.id !== bookingId) return b;
      
      if (b.status === BookingStatus.PENDING_CHECK_IN) {
        return { ...b, status: BookingStatus.CONFIRMED };
      }
      
      if (b.status === BookingStatus.PENDING_CHECK_OUT) {
        return { ...b, status: BookingStatus.CHECKED_IN };
      }
      
      return b;
    }));
  }, []);

  // Staff confirms check-out
  const handleConfirmCheckOut = useCallback((bookingId: string) => {
    setBookings(prevBookings => prevBookings.map(b => 
      b.id === bookingId ? { ...b, status: BookingStatus.COMPLETED } : b
    ));
  }, []);
  
  const handleAddResource = useCallback((resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
        ...resource,
        id: `resource-${Date.now()}`
    };
    setResources(prev => [...prev, newResource]);
  }, []);

  const handleDeleteResource = useCallback((resourceId: string) => {
    setBookings(prev => prev.filter(b => b.resourceId !== resourceId));
    setResources(prev => prev.filter(r => r.id !== resourceId));
  }, []);


  const handleLogin = () => {
    setCurrentView('PORTAL');
  };

  const handleAppLaunch = (appName: string) => {
    if (appName === 'libsched') {
        setCurrentView('APP');
    }
  };

  const handleBackToPortal = () => {
      setCurrentView('PORTAL');
  };

  if (currentView === 'LOGIN') {
      return <LoginView onLogin={handleLogin} />;
  }

  if (currentView === 'PORTAL') {
      return <PortalView user={currentUser} onSelectApp={handleAppLaunch} onLogout={() => setCurrentView('LOGIN')} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800">
      <Header
        user={currentUser}
        onRoleChange={handleRoleChange}
        onBack={handleBackToPortal}
      />
      <main className="container mx-auto p-4 md:p-8">
        {currentUser.role === UserRole.STUDENT ? (
          <StudentView
            student={currentUser}
            resources={resources}
            bookings={bookings}
            onBook={handleAddBooking}
            onCancel={handleCancelBooking}
            onCheckIn={handleCheckInRequest}
            onCheckOut={handleCheckOutRequest}
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        ) : (
          <StaffView
            staff={currentUser}
            resources={resources}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onConfirmCheckIn={handleConfirmCheckIn}
            onConfirmCheckOut={handleConfirmCheckOut}
            onDeclineRequest={handleDeclineRequest}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
      </main>
    </div>
  );
};

export default App;
