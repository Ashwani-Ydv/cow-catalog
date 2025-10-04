export type CowSex = 'male' | 'female';

export type CowStatus = 'Active' | 'In Treatment' | 'Deceased';

export type EventType = 
  | 'weight_check' 
  | 'treatment' 
  | 'pen_move' 
  | 'death'
  | 'created';

export interface CowEvent {
  id: string;
  type: EventType;
  date: string; // ISO date string
  description: string;
  weight?: number; // For weight_check events
  fromPen?: string; // For pen_move events
  toPen?: string; // For pen_move events
}

export interface Cow {
  id: string;
  earTag: string; // Unique identifier
  sex: CowSex;
  pen: string;
  status: CowStatus;
  weight?: number; // Current weight in kg
  events: CowEvent[];
  createdAt: string; // ISO date string
}

export interface CowFilters {
  searchQuery: string;
  statusFilter: CowStatus | 'all';
  penFilter: string; // Empty string means 'all'
}
