import { Cow, CowEvent, CowSex, CowStatus } from '@/types/cow';
import { generateId } from './cowUtils';

const PENS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const STATUSES: CowStatus[] = ['Active', 'In Treatment', 'Deceased'];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function generateEvents(cowId: string, createdDate: string): CowEvent[] {
  const events: CowEvent[] = [];
  const createdTime = new Date(createdDate).getTime();
  const now = Date.now();
  const daysSinceCreated = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24));

  // Creation event
  events.push({
    id: generateId(),
    type: 'created',
    date: createdDate,
    description: 'Cow added to catalog',
  });

  // Generate some weight checks
  const numWeightChecks = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numWeightChecks; i++) {
    const daysAgo = Math.floor((daysSinceCreated / (numWeightChecks + 1)) * (i + 1));
    events.push({
      id: generateId(),
      type: 'weight_check',
      date: randomDate(daysAgo),
      description: 'Regular weight check',
      weight: Math.floor(Math.random() * 200) + 300, // 300-500 kg
    });
  }

  // Maybe add a treatment
  if (Math.random() > 0.7) {
    events.push({
      id: generateId(),
      type: 'treatment',
      date: randomDate(Math.floor(Math.random() * daysSinceCreated)),
      description: randomFromArray([
        'Vaccination',
        'Antibiotic treatment',
        'Vitamin injection',
        'Hoof trimming',
      ]),
    });
  }

  // Maybe add a pen move
  if (Math.random() > 0.6) {
    const fromPen = randomFromArray(PENS);
    let toPen = randomFromArray(PENS);
    while (toPen === fromPen) {
      toPen = randomFromArray(PENS);
    }
    events.push({
      id: generateId(),
      type: 'pen_move',
      date: randomDate(Math.floor(Math.random() * daysSinceCreated)),
      description: 'Pen relocation',
      fromPen,
      toPen,
    });
  }

  // Sort events by date
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function generateSampleCows(count: number = 20): Cow[] {
  const cows: Cow[] = [];
  const usedTags = new Set<string>();

  for (let i = 0; i < count; i++) {
    let earTag: string;
    do {
      earTag = `${Math.floor(Math.random() * 9000) + 1000}`;
    } while (usedTags.has(earTag));
    usedTags.add(earTag);

    const createdDate = randomDate(Math.floor(Math.random() * 365) + 30); // 30-395 days ago
    const sex: CowSex = Math.random() > 0.5 ? 'male' : 'female';
    const pen = randomFromArray(PENS);
    const status: CowStatus = Math.random() > 0.85 
      ? randomFromArray(['In Treatment', 'Deceased'] as CowStatus[])
      : 'Active';
    
    const cowId = generateId();
    const events = generateEvents(cowId, createdDate);
    
    // Get current weight from most recent weight check
    const weightEvents = events.filter(e => e.type === 'weight_check' && e.weight);
    const currentWeight = weightEvents.length > 0 
      ? weightEvents[weightEvents.length - 1].weight 
      : undefined;

    cows.push({
      id: cowId,
      earTag,
      sex,
      pen,
      status,
      weight: currentWeight,
      events,
      createdAt: createdDate,
    });
  }

  return cows.sort((a, b) => a.earTag.localeCompare(b.earTag));
}
