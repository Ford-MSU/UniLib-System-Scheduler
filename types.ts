
export enum ResourceType {
  COMPUTER = 'Computer Station',
  COLLAB_ROOM = 'Collaboration Room',
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description: string;
}

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  PENDING_CHECK_IN = 'Pending Check-In', // Waiting for staff approval
  CHECKED_IN = 'Checked In',
  PENDING_CHECK_OUT = 'Pending Check-Out', // Waiting for staff approval
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled', // By user
  NO_SHOW = 'No Show', // System cancelled due to lateness
}

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  timeSlot: string;
  date: string; // YYYY-MM-DD format
  status: BookingStatus;
  bookedAt?: number; // Timestamp for demo/documentation purposes (1-minute timer)
}

export enum UserRole {
  STUDENT = 'Student',
  STAFF = 'Staff', // Changed case to match UI
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string; // e.g., Student or Librarian
}
