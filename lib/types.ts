export type MenuItem = { id: string; category: string; name: string; description: string; ingredients: string; image: string | null; available: boolean };
export type Slot = {id: string; start: string; end: string; remaining: number};
export type Order = {reference: string; name: string; start: string; end: string; created: string; items: {name: string; quantity: number}[]};
export const zone = 'UTC';
export function dayLabel(date: string) { return new Intl.DateTimeFormat('es', {timeZone: zone, weekday:'long', day:'numeric', month:'long', year:'numeric'}).format(new Date(date)); }
export function timeLabel(date: string) { return new Intl.DateTimeFormat('es', {timeZone: zone, hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).format(new Date(date)); }
