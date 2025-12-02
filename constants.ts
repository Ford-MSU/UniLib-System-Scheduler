
import { Resource, User, ResourceType, UserRole, BookingStatus, Booking } from './types';

export const TIME_SLOTS: string[] = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

// Configuration for Check-In Grace Period
// Current: 1 Minute (For Documentation/Demo)
// Future: Change this to `15 * 60 * 1000` for the 15-minute policy
export const CHECK_IN_GRACE_PERIOD_MS = 60 * 1000; 

export const MOCK_RESOURCES: Resource[] = [
  { id: 'comp-1', name: 'Computer 1 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'comp-2', name: 'Computer 2 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'comp-3', name: 'Computer 3 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'comp-4', name: 'Computer 4 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'comp-5', name: 'Computer 5 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'comp-6', name: 'Computer 6 (Solo)', type: ResourceType.COMPUTER, description: 'High-performance PC' },
  { id: 'room-1', name: 'Collaborative Room 1', type: ResourceType.COLLAB_ROOM, description: '4 persons' },
  { id: 'room-2', name: 'Collaborative Room 2', type: ResourceType.COLLAB_ROOM, description: '6 persons' },
  { id: 'room-3', name: 'Collaborative Room 3', type: ResourceType.COLLAB_ROOM, description: '6 persons' },
  { id: 'room-4', name: 'Collaborative Room 4', type: ResourceType.COLLAB_ROOM, description: '6-8 persons' },
  { id: 'room-5', name: 'Collaborative Room 5', type: ResourceType.COLLAB_ROOM, description: '6-8 persons' },
  { id: 'room-6', name: 'Collaborative Room 6', type: ResourceType.COLLAB_ROOM, description: '6-12 persons' },
];

export const MOCK_USERS: { [key in UserRole]: User } = {
  [UserRole.STUDENT]: { id: 'student-123', name: 'Arvin S. Jimenez', role: UserRole.STUDENT, department: 'Student' },
  [UserRole.STAFF]: { id: 'staff-456', name: 'Dizon, Evelyn R.', role: UserRole.STAFF, department: 'Librarian' },
};

// Mock bookings to demonstrate "Occupied" status
const today = new Date().toISOString().split('T')[0];
export const MOCK_BOOKINGS: Booking[] = [];