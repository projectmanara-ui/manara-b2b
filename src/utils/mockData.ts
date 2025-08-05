import { User, Organization, Trip, Location, Wallet, Transaction, Shift } from '../types';

export const organizations: Organization[] = [
  {
    id: '1',
    name: 'Safaricom PLC',
    monthlyAllowance: 8000,
    currency: 'KES'
  },
  {
    id: '2',
    name: 'Equity Bank Kenya',
    monthlyAllowance: 6500,
    currency: 'KES'
  },
  {
    id: '3',
    name: 'Kenya Airways',
    monthlyAllowance: 7500,
    currency: 'KES'
  },
  {
    id: '4',
    name: 'Nairobi Hospital',
    monthlyAllowance: 5000,
    currency: 'KES'
  }
];

export const pickupLocations: Location[] = [
  {
    id: '1',
    name: 'Westlands Square',
    address: 'Westlands, Nairobi',
    coordinates: { latitude: -1.2676, longitude: 36.8108 },
    type: 'pickup_point'
  },
  {
    id: '2',
    name: 'CBD Bus Station',
    address: 'Central Business District, Nairobi',
    coordinates: { latitude: -1.2864, longitude: 36.8172 },
    type: 'pickup_point'
  },
  {
    id: '3',
    name: 'Eastlands Terminal',
    address: 'Eastlands, Nairobi',
    coordinates: { latitude: -1.2921, longitude: 36.8219 },
    type: 'pickup_point'
  },
  {
    id: '4',
    name: 'Karen Shopping Centre',
    address: 'Karen, Nairobi',
    coordinates: { latitude: -1.3197, longitude: 36.7085 },
    type: 'pickup_point'
  }
];

export const mockUser: User = {
  id: '1',
  name: 'Amina Wanjiku',
  email: 'amina.wanjiku@safaricom.co.ke',
  phone: '+254712345678',
  organizationId: '1',
  organizationName: 'Safaricom PLC',
  employeeId: 'SAF001234',
  emergencyContact: {
    name: 'James Wanjiku',
    phone: '+254723456789',
    relationship: 'Spouse'
  },
  shiftPreferences: {
    regularShift: 'morning',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
};

export const mockTrips: Trip[] = [
  {
    id: '1',
    userId: '1',
    type: 'to_work',
    status: 'booked',
    pickupLocation: pickupLocations[0],
    dropLocation: {
      id: 'office1',
      name: 'Safaricom Headquarters',
      address: 'Westlands, Nairobi',
      coordinates: { latitude: -1.2630, longitude: 36.8063 },
      type: 'office'
    },
    scheduledTime: '2025-01-20T06:30:00Z',
    fare: 250,
    estimatedDuration: 25
  },
  {
    id: '2',
    userId: '1',
    type: 'from_work',
    status: 'completed',
    pickupLocation: {
      id: 'office1',
      name: 'Safaricom Headquarters',
      address: 'Westlands, Nairobi',
      coordinates: { latitude: -1.2630, longitude: 36.8063 },
      type: 'office'
    },
    dropLocation: {
      id: 'home1',
      name: 'Home',
      address: 'Kileleshwa, Nairobi',
      coordinates: { latitude: -1.2833, longitude: 36.7833 },
      type: 'home'
    },
    scheduledTime: '2025-01-19T18:00:00Z',
    actualPickupTime: '2025-01-19T18:05:00Z',
    fare: 300,
    estimatedDuration: 30
  }
];

export const mockWallet: Wallet = {
  userId: '1',
  balance: 6250,
  monthlyAllowance: 8000,
  currency: 'KES',
  lastUpdated: '2025-01-20T00:00:00Z'
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'allowance',
    amount: 8000,
    description: 'Monthly Transport Allowance - January 2025',
    timestamp: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'deduction',
    amount: -250,
    description: 'Trip to work - Westlands to Office',
    tripId: '1',
    timestamp: '2025-01-19T06:30:00Z'
  }
];

export const mockShifts: Shift[] = [
  {
    id: '1',
    userId: '1',
    date: '2025-01-20',
    startTime: '07:00',
    endTime: '15:00',
    type: 'morning',
    isRegular: true
  },
  {
    id: '2',
    userId: '1',
    date: '2025-01-21',
    startTime: '07:00',
    endTime: '15:00',
    type: 'morning',
    isRegular: true
  }
];