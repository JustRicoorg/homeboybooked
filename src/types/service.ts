
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface TimeSlot {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  slotInterval?: number;
  isSpecialDay?: boolean;
  specialDayName?: string;
}

export interface RecurringSchedule {
  id?: number;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface BookingSlot {
  time: string;
  available: boolean;
}

export interface RescheduleParams {
  id: string;
  email: string;
  name: string;
}
