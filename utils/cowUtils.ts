import { Cow, CowEvent } from '@/types/cow';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getLastEventDate(cow: Cow): string {
  if (cow.events.length === 0) {
    return cow.createdAt;
  }
  
  // Events are assumed to be sorted by date, get the most recent
  const sortedEvents = [...cow.events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sortedEvents[0].date;
}

export function getEventDescription(event: CowEvent): string {
  switch (event.type) {
    case 'created':
      return 'Cow added to catalog';
    case 'weight_check':
      return event.weight ? `Weight recorded: ${event.weight} kg` : 'Weight check';
    case 'treatment':
      return event.description || 'Treatment administered';
    case 'pen_move':
      return `Moved from ${event.fromPen} to ${event.toPen}`;
    case 'death':
      return event.description || 'Cow deceased';
    default:
      return event.description;
  }
}

export function calculateDailyWeightGain(cow: Cow): number | null {
  const weightEvents = cow.events
    .filter(e => e.type === 'weight_check' && e.weight)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (weightEvents.length < 2) {
    return null;
  }

  const firstEvent = weightEvents[0];
  const lastEvent = weightEvents[weightEvents.length - 1];
  
  const weightDiff = lastEvent.weight! - firstEvent.weight!;
  const daysDiff = Math.max(1, Math.floor(
    (new Date(lastEvent.date).getTime() - new Date(firstEvent.date).getTime()) / (1000 * 60 * 60 * 24)
  ));

  return parseFloat((weightDiff / daysDiff).toFixed(2));
}

export function getUniquePens(cows: Cow[]): string[] {
  const pens = new Set(cows.map(c => c.pen));
  return Array.from(pens).sort();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
