const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00"] as const;

export const todayISO = () => toISO(new Date());
export const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISO(d);
};

/** Today and the next six days. */
export function nextDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { iso: toISO(d), day: i === 0 ? "Today" : DAYS[d.getDay()], date: d.getDate() };
  });
}

/** "15:00" -> "3:00 PM" */
export function slotLabel(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
}

/** Times still ahead on that day. */
export function slotsOn(date: string, slots: readonly string[]) {
  if (date !== todayISO()) return [...slots];
  const now = new Date();
  const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return slots.filter((s) => s > hm);
}
