export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  organizationName: string;
  employeeId: string;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  shiftPreferences: {
    regularShift: 'morning' | 'afternoon' | 'night';
    workDays: string[];
  };
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  monthlyAllowance: number;
  currency: string;
}

export interface Trip {
  id: string;
  userId: string;
  type: 'to_work' | 'from_work';
  status: 'booked' | 'in_transit' | 'completed' | 'cancelled';
  pickupLocation: Location;
  dropLocation: Location;
  scheduledTime: string;
  actualPickupTime?: string;
  fare: number;
  driverId?: string;
  vehicleId?: string;
  route?: string;
  estimatedDuration: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'pickup_point' | 'home' | 'office';
}

export interface Wallet {
  userId: string;
  balance: number;
  monthlyAllowance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deduction' | 'allowance';
  amount: number;
  description: string;
  tripId?: string;
  timestamp: string;
}

export interface Shift {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night';
  isRegular: boolean;
}