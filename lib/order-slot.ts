/** Shared by the transactional endpoint and fixed-clock expiration verification. */
export function isOrderSlotAvailable(slot: Record<string, unknown> | undefined, now = new Date().toISOString()): boolean {
 return !!slot && String(slot.start) > now && Number(slot.occupied) < Number(slot.capacity);
}
