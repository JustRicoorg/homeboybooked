
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
}
