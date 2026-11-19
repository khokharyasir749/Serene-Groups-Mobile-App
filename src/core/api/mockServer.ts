// DEV-ONLY in-memory backend, seeded with real Serene Heights Group data (projects, room types, published
// plans). Customers, bookings and payments are synthetic. Active when __DEV__ and EXPO_PUBLIC_MOCK_AUTH !== "false".
// It is plugged in as the `fetchFn` of the real fetchBaseQuery, so headers, Bearer auth, x-device-id and the
// 401-refresh flow all run exactly as they will against the Express/Prisma API.
import { ALL_PERMISSIONS, P } from "@/core/constants/api";
import {
  CUSTOM_PLAN_ID,
  MAX_UNITS_PER_BOOKING,
  PLANS,
  PROJECT_SLUGS,
  ROOMS,
  SPU_PLAN_ID,
  NATHIA_GALI_TOTAL_UNITS,
  planLabel,
  unitLabel,
  type ProjectSlug,
} from "@/core/constants/serene";
import { addMonthsISO, buildPlan, todayISO, toISO } from "@/core/lib/plan";
import type { AuthPayload, AuthUser, MePayload, PaginatedResponse } from "@/core/api/types/api";
import type {
  Booking,
  BookingListItem,
  BookingStats,
  BookingStatus,
  CreateBookingPayload,
} from "@/features/bookings/types";
import type {
  DueInstallment,
  Installment,
  InstallmentStatus,
  Payment,
  PaymentMethod,
  PaymentSummary,
  RecordPaymentPayload,
} from "@/features/payments/types";

export const MOCK_ENABLED: boolean = __DEV__ && process.env.EXPO_PUBLIC_MOCK_AUTH !== "false";

const LATENCY_MS = 200;
const ACCESS_TTL_MS = 10 * 60 * 1000;
const DUE_SOON_DAYS = 7;

// ── Users ───────────────────────────────────────────────────────────────────────────────────────
type MockUser = AuthUser & { permissions: string[] };
const USERS: Record<string, MockUser> = {
  "admin@serene.local": {
    id: "u-admin",
    name: "Admin (Mock)",
    email: "admin@serene.local",
    role: "admin",
    permissions: [...ALL_PERMISSIONS],
  },
  // No customers:pii → phone + CNIC come back null, exercising the "—" masking path.
  "viewer@serene.local": {
    id: "u-viewer",
    name: "Viewer (Mock)",
    email: "viewer@serene.local",
    role: "viewer",
    permissions: [P.DASHBOARD_READ, P.BOOKINGS_READ, P.PAYMENTS_READ],
  },
  // An investor sees only their own holdings (server-scoped), never the staff ledger.
  "investor@serene.local": {
    id: "u-investor",
    name: "Investor (Mock)",
    email: "investor@serene.local",
    role: "investor",
    permissions: [P.PORTFOLIO_READ, P.MY_STAYS],
  },
};

const GUEST_PREFIX = "u-guest-";
const GUEST_NAMES = new Map<string, string>();
const MOCK_OTP = "123456";

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Stateless tokens so a Fast Refresh / app reload doesn't log the dev out.
const SESSIONS = new Map<string, { deviceId: string }>();
const mkAccess = (u: MockUser, deviceId: string) => `mock-at.${u.id}.${deviceId}.${Date.now() + ACCESS_TTL_MS}`;
const mkRefresh = (u: MockUser, deviceId: string) => `mock-rt.${u.id}.${deviceId}.${Math.random().toString(16).slice(2)}`;
// Guests are created on the fly from their phone number (stateless, so reloads keep them signed in).
const guestFor = (id: string): MockUser => ({
  id,
  name: GUEST_NAMES.get(id) ?? "Guest",
  email: "",
  role: "guest",
  permissions: [P.MY_STAYS],
});
const userById = (id: string): MockUser | undefined =>
  id?.startsWith(GUEST_PREFIX) ? guestFor(id) : Object.values(USERS).find((u) => u.id === id);
const SIGNED_IN_ELSEWHERE = "Your account was signed in on another device. Please sign in again.";

function authPayload(u: MockUser, deviceId: string): AuthPayload {
  SESSIONS.set(u.id, { deviceId });
  return {
    accessToken: mkAccess(u, deviceId),
    refreshToken: mkRefresh(u, deviceId),
    user: publicUser(u),
    permissions: u.permissions,
  };
}
const publicUser = ({ id, name, email, role }: MockUser): AuthUser => ({ id, name, email, role });

function authenticate(headers: Headers): { user: MockUser; deviceId: string } {
  const raw = headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const [kind, uid, deviceId, exp] = raw.split(".");
  const user = kind === "mock-at" ? userById(uid) : undefined;
  if (!user) throw new HttpError(401, "Authentication required.");
  if (Number(exp) < Date.now()) throw new HttpError(401, "Access token expired.");
  const session = SESSIONS.get(user.id);
  if (session && session.deviceId !== deviceId) throw new HttpError(401, SIGNED_IN_ELSEWHERE);
  if (headers.get("x-device-id") !== deviceId) throw new HttpError(401, "Device mismatch. Please sign in again.");
  return { user, deviceId };
}

const need = (user: MockUser, perm: string) => {
  if (!user.permissions.includes(perm)) throw new HttpError(403, "You don't have permission to do that.");
};

// ── Data ────────────────────────────────────────────────────────────────────────────────────────
type InstRec = { no: number; dueDate: string; amount: number; paidAmount: number };
type BookingRec = Omit<BookingListItem, "paidTotal" | "outstanding" | "overdueCount" | "nextDue" | "unitLabel"> & {
  ownerId?: string;
  installments: InstRec[];
};

const BOOKINGS: BookingRec[] = [];
const PAYMENTS: Payment[] = [];
let seq = { booking: 0, payment: 0 };
const METHODS: PaymentMethod[] = ["bank_transfer", "cash", "online", "cheque"];

const projectCode = (p: ProjectSlug) => (p === "lahore" ? "LHR" : "NG");

function createRec(input: {
  project: ProjectSlug;
  unitType: string;
  planId: string;
  units: number;
  total: number;
  name: string;
  phone: string;
  cnic: string;
  startDate: string;
  status?: BookingStatus;
  notes?: string | null;
}): BookingRec {
  const plan = buildPlan(input.total);
  seq.booking += 1;
  const installments: InstRec[] = plan.amounts.map((amount, no) => ({
    no,
    dueDate: addMonthsISO(input.startDate, no),
    amount,
    paidAmount: 0,
  }));
  const rec: BookingRec = {
    id: `bk-${seq.booking}`,
    reference: `SH-${projectCode(input.project)}-${String(seq.booking).padStart(4, "0")}`,
    project: input.project,
    unitType: input.unitType,
    units: input.units,
    planId: input.planId,
    customer: { name: input.name, phone: input.phone, cnic: input.cnic },
    status: input.status ?? "pending",
    totalPrice: plan.total,
    downPayment: plan.down,
    monthlyInstallment: plan.monthly,
    months: plan.months,
    createdAt: `${input.startDate}T09:00:00.000Z`,
    startDate: input.startDate,
    notes: input.notes ?? null,
    installments,
  };
  BOOKINGS.unshift(rec);
  return rec;
}

function applyPayment(rec: BookingRec, amount: number, method: PaymentMethod, receiptRef: string | null, paidAt: string) {
  let remaining = amount;
  let first: number | null = null;
  for (const inst of rec.installments) {
    if (remaining <= 0) break;
    const room = inst.amount - inst.paidAmount;
    if (room <= 0) continue;
    const pay = Math.min(room, remaining);
    inst.paidAmount += pay;
    remaining -= pay;
    if (first === null) first = inst.no;
  }
  seq.payment += 1;
  const payment: Payment = {
    id: `pay-${seq.payment}`,
    bookingId: rec.id,
    reference: rec.reference,
    customerName: rec.customer.name,
    project: rec.project,
    amount,
    method,
    receiptRef,
    paidAt,
    kind: first === 0 ? "down" : "installment",
    installmentNo: first,
  };
  PAYMENTS.unshift(payment);
  return payment;
}

type Seed = Omit<Parameters<typeof createRec>[0], "startDate"> & { monthsAgo: number; paidThrough: number; partial?: number };

function seed(s: Seed) {
  const start = addMonthsISO(todayISO(), -s.monthsAgo);
  const rec = createRec({ ...s, startDate: start });
  for (let i = 0; i < s.paidThrough; i++) {
    const inst = rec.installments[i];
    applyPayment(rec, inst.amount, METHODS[(i + seq.booking) % METHODS.length], `RC-${rec.id}-${i}`, inst.dueDate);
  }
  if (s.partial) applyPayment(rec, s.partial, "cash", `RC-${rec.id}-part`, todayISO());
  if (rec.status !== "cancelled") syncStatus(rec);
  return rec;
}

function syncStatus(rec: BookingRec) {
  if (rec.status === "cancelled") return;
  if (rec.installments.every((i) => i.paidAmount >= i.amount)) rec.status = "completed";
  else if (rec.installments[0].paidAmount >= rec.installments[0].amount) rec.status = "confirmed";
}

const planTotal = (id: string) => PLANS.find((p) => p.id === id)?.total ?? 0;
const roomSlug = (i: number) => ROOMS[i].slug;
const nm = {
  nathia: "nathia-gali",
  lahore: "lahore",
} as const;
const CNIC = (n: number) => `35202-${String(1234500 + n).padStart(7, "0")}-${n % 10}`;
const PHONE = (n: number) => `03${String(10 + n).padStart(2, "0")}-${String(5550100 + n)}`;

function seedAll() {
  // [project, unitType, planId, units, total, name, monthsAgo, paidThrough, extras]
  seed({ project: nm.nathia, unitType: SPU_PLAN_ID, planId: SPU_PLAN_ID, units: 4, total: planTotal(SPU_PLAN_ID) * 4, name: "Ayesha Malik", phone: PHONE(1), cnic: CNIC(1), monthsAgo: 8, paidThrough: 9 });
  seed({ project: nm.nathia, unitType: "1bhk-667", planId: "1bhk-667", units: 1, total: planTotal("1bhk-667"), name: "Bilal Ahmed", phone: PHONE(2), cnic: CNIC(2), monthsAgo: 14, paidThrough: 13 });
  seed({ project: nm.nathia, unitType: "1bhk-673", planId: "1bhk-673", units: 1, total: planTotal("1bhk-673"), name: "Hamza Qureshi", phone: PHONE(3), cnic: CNIC(3), monthsAgo: 3, paidThrough: 4 });
  seed({ project: nm.nathia, unitType: "1bhk-734", planId: "1bhk-734", units: 1, total: planTotal("1bhk-734"), name: "Sana Tariq", phone: PHONE(4), cnic: CNIC(4), monthsAgo: 0, paidThrough: 0 });
  seed({ project: nm.nathia, unitType: SPU_PLAN_ID, planId: SPU_PLAN_ID, units: 2, total: planTotal(SPU_PLAN_ID) * 2, name: "Usman Raza", phone: PHONE(5), cnic: CNIC(5), monthsAgo: 20, paidThrough: 18 });
  seed({ project: nm.nathia, unitType: roomSlug(0), planId: CUSTOM_PLAN_ID, units: 1, total: 22000000, name: "Mariam Fatima", phone: PHONE(6), cnic: CNIC(6), monthsAgo: 6, paidThrough: 7 });
  seed({ project: nm.nathia, unitType: roomSlug(1), planId: CUSTOM_PLAN_ID, units: 1, total: 25500000, name: "Zain Abbas", phone: PHONE(7), cnic: CNIC(7), monthsAgo: 10, paidThrough: 9 });
  seed({ project: nm.nathia, unitType: roomSlug(2), planId: CUSTOM_PLAN_ID, units: 1, total: 29000000, name: "Farah Naz", phone: PHONE(8), cnic: CNIC(8), monthsAgo: 2, paidThrough: 2, partial: 1500000 });
  seed({ project: nm.nathia, unitType: roomSlug(3), planId: CUSTOM_PLAN_ID, units: 1, total: 38000000, name: "Imran Siddiqui", phone: PHONE(9), cnic: CNIC(9), monthsAgo: 5, paidThrough: 6 });
  seed({ project: nm.nathia, unitType: roomSlug(4), planId: CUSTOM_PLAN_ID, units: 1, total: 32500000, name: "Noor ul Ain", phone: PHONE(10), cnic: CNIC(10), monthsAgo: 12, paidThrough: 13 });
  seed({ project: nm.lahore, unitType: "hotel-apartment", planId: CUSTOM_PLAN_ID, units: 1, total: 18000000, name: "Kamran Butt", phone: PHONE(11), cnic: CNIC(11), monthsAgo: 4, paidThrough: 5 });
  seed({ project: nm.lahore, unitType: "office", planId: CUSTOM_PLAN_ID, units: 1, total: 45000000, name: "Rabia Sheikh", phone: PHONE(12), cnic: CNIC(12), monthsAgo: 7, paidThrough: 6 });
  seed({ project: nm.lahore, unitType: "co-working", planId: CUSTOM_PLAN_ID, units: 1, total: 30000000, name: "Tahir Mehmood", phone: PHONE(13), cnic: CNIC(13), monthsAgo: 1, paidThrough: 2 });
  seed({ project: nm.lahore, unitType: "hotel-apartment", planId: CUSTOM_PLAN_ID, units: 1, total: 15500000, name: "Hina Javed", phone: PHONE(14), cnic: CNIC(14), monthsAgo: 9, paidThrough: 10 });
  seed({ project: nm.nathia, unitType: SPU_PLAN_ID, planId: SPU_PLAN_ID, units: 1, total: planTotal(SPU_PLAN_ID), name: "Saad Khalid", phone: PHONE(15), cnic: CNIC(15), monthsAgo: 11, paidThrough: 4, status: "cancelled", notes: "Cancelled at customer request." });
  seed({ project: nm.nathia, unitType: "1bhk-667", planId: "1bhk-667", units: 1, total: planTotal("1bhk-667"), name: "Laiba Anwar", phone: PHONE(16), cnic: CNIC(16), monthsAgo: 0, paidThrough: 0 });
  BOOKINGS.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
seedAll();

// The mock investor owns three of the seeded holdings.
for (const r of BOOKINGS) {
  if (["Ayesha Malik", "Hamza Qureshi", "Mariam Fatima"].includes(r.customer.name)) r.ownerId = "u-investor";
}

type StayRec = { id: string; reference: string; ownerId: string; roomSlug: string; roomName: string; checkIn: string; checkOut: string; adults: number; status: "requested" | "confirmed"; createdAt: string };
const STAYS: StayRec[] = [];

function availability() {
  return stats().inventory.rooms;
}

// ── Views ───────────────────────────────────────────────────────────────────────────────────────
function instStatus(i: InstRec, today: string): InstallmentStatus {
  if (i.paidAmount >= i.amount) return "paid";
  if (i.dueDate < today) return "overdue";
  if (i.paidAmount > 0) return "partial";
  const soon = addDays(today, DUE_SOON_DAYS);
  return i.dueDate <= soon ? "due" : "upcoming";
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + n));
}

const instView = (i: InstRec, today: string): Installment => ({
  no: i.no,
  label: i.no === 0 ? "Down payment" : `Instalment ${i.no}`,
  dueDate: i.dueDate,
  amount: i.amount,
  paidAmount: i.paidAmount,
  status: instStatus(i, today),
});

function listItem(rec: BookingRec, pii: boolean): BookingListItem {
  const today = todayISO();
  const live = rec.status !== "cancelled";
  const paidTotal = rec.installments.reduce((s, i) => s + i.paidAmount, 0);
  const unpaid = rec.installments.find((i) => i.paidAmount < i.amount);
  const { installments: _omit, ...rest } = rec;
  return {
    ...rest,
    customer: { name: rec.customer.name, phone: pii ? rec.customer.phone : null, cnic: pii ? rec.customer.cnic : null },
    unitLabel: unitLabelFor(rec),
    paidTotal,
    outstanding: live ? rec.totalPrice - paidTotal : 0,
    overdueCount: live ? rec.installments.filter((i) => instStatus(i, today) === "overdue").length : 0,
    nextDue: live && unpaid ? { no: unpaid.no, dueDate: unpaid.dueDate, amount: unpaid.amount - unpaid.paidAmount } : null,
  };
}

function unitLabelFor(rec: Pick<BookingRec, "project" | "unitType" | "planId">) {
  const preset = PLANS.find((p) => p.id === rec.planId);
  return preset && rec.planId !== SPU_PLAN_ID ? planLabel(preset) : unitLabel(rec.project, rec.unitType);
}

const detail = (rec: BookingRec, pii: boolean): Booking => ({
  ...listItem(rec, pii),
  installments: rec.installments.map((i) => instView(i, todayISO())),
});

// ── Router ──────────────────────────────────────────────────────────────────────────────────────
type Ctx = { method: string; seg: string[]; query: Record<string, string>; body: Record<string, unknown>; headers: Headers };
type Result = { status?: number; message?: string; data: unknown };

const num = (v: unknown, d: number) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.floor(Number(v)) : d);

function paginate<T>(items: T[], q: Record<string, string>): PaginatedResponse<T> {
  const limit = Math.min(50, num(q.limit, 10));
  const page = num(q.page, 1);
  return { items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)) };
}

const matchText = (hay: string[], needle?: string) => !needle || hay.some((h) => h.toLowerCase().includes(needle.trim().toLowerCase()));

function route(c: Ctx): Result {
  const [root, a] = c.seg;

  if (root === "auth") {
    if (a === "login" && c.method === "POST") {
      const user = USERS[String(c.body.email ?? "").trim().toLowerCase()];
      if (!user || !c.body.password) throw new HttpError(401, "Invalid email or password.");
      return { message: "Signed in", data: authPayload(user, c.headers.get("x-device-id") ?? "unknown") };
    }
    if (a === "refresh" && c.method === "POST") {
      const [kind, uid, deviceId] = String(c.body.refreshToken ?? "").split(".");
      const user = kind === "mock-rt" ? userById(uid) : undefined;
      if (!user) throw new HttpError(401, "Your session has expired. Please sign in again.");
      const session = SESSIONS.get(user.id);
      if (session && session.deviceId !== deviceId) throw new HttpError(401, SIGNED_IN_ELSEWHERE);
      return { data: authPayload(user, deviceId) };
    }
    if (a === "otp" && c.method === "POST") {
      const phone = String(c.body.phone ?? "").replace(/\D/g, "");
      if (phone.length < 10) throw new HttpError(422, "Enter a valid mobile number.");
      if (c.seg[2] === "request") return { message: "Code sent (mock code: " + MOCK_OTP + ")", data: null };
      if (c.seg[2] === "verify") {
        if (String(c.body.code ?? "") !== MOCK_OTP) throw new HttpError(401, "That code isn't right. Try again.");
        const id = GUEST_PREFIX + phone;
        const name = String(c.body.name ?? "").trim();
        if (name) GUEST_NAMES.set(id, name);
        return { message: "Verified", data: authPayload(guestFor(id), c.headers.get("x-device-id") ?? "unknown") };
      }
    }
    if (a === "logout" && c.method === "POST") {
      const { user } = authenticate(c.headers);
      SESSIONS.delete(user.id);
      return { message: "Signed out", data: null };
    }
    if (a === "me" && c.method === "GET") {
      const { user } = authenticate(c.headers);
      const me: MePayload = { user: publicUser(user), permissions: user.permissions };
      return { data: me };
    }
    throw new HttpError(404, "Not found");
  }

  if (root === "public" && a === "availability" && c.method === "GET") return { data: availability() };

  const { user } = authenticate(c.headers);
  const pii = user.permissions.includes(P.CUSTOMERS_PII);

  if (root === "stays") {
    // Guest stays are public: any signed-in account (guest, staff, investor, admin) can reserve and list its own stays.
    if (a === "mine" && c.method === "GET") {
      return { data: STAYS.filter((x) => x.ownerId === user.id) };
    }
    if (!a && c.method === "POST") {
      const room = ROOMS.find((r) => r.slug === c.body.roomSlug);
      if (!room) throw new HttpError(422, "Choose a residence type.");
      const checkIn = String(c.body.checkIn ?? "");
      const checkOut = String(c.body.checkOut ?? "");
      if (!(checkIn >= todayISO()) || !(checkOut > checkIn)) throw new HttpError(422, "Check your dates.");
      const left = availability().find((r) => r.slug === room.slug)?.available ?? 0;
      if (left <= 0) throw new HttpError(409, "That residence type is fully booked.");
      const stay: StayRec = {
        id: "st-" + (STAYS.length + 1),
        reference: "ST-" + String(STAYS.length + 1).padStart(4, "0"),
        ownerId: user.id,
        roomSlug: room.slug,
        roomName: room.name,
        checkIn,
        checkOut,
        adults: Math.min(4, Math.max(1, Number(c.body.adults) || 1)),
        status: "requested",
        createdAt: new Date().toISOString(),
      };
      STAYS.unshift(stay);
      return { status: 201, message: "Reservation requested", data: stay };
    }
    throw new HttpError(404, "Not found");
  }

  if (root === "portfolio" && a === "me" && c.method === "GET") {
    need(user, P.PORTFOLIO_READ);
    const mine = BOOKINGS.filter((r) => r.ownerId === user.id);
    const items = mine.map((r) => listItem(r, true));
    const live = items.filter((i) => i.status !== "cancelled");
    const nextDue = live.map((i) => i.nextDue).filter((d): d is NonNullable<typeof d> => d !== null).sort((x, y) => (x.dueDate < y.dueDate ? -1 : 1))[0] ?? null;
    return {
      data: {
        investor: { name: user.name },
        holdings: items,
        payments: PAYMENTS.filter((p) => mine.some((r) => r.id === p.bookingId)).slice(0, 20),
        totals: {
          invested: live.reduce((t, i) => t + i.totalPrice, 0),
          paid: live.reduce((t, i) => t + i.paidTotal, 0),
          outstanding: live.reduce((t, i) => t + i.outstanding, 0),
          overdueCount: live.reduce((t, i) => t + i.overdueCount, 0),
          nextDue,
        },
      },
    };
  }

  if (root === "bookings") {
    if (a === "stats" && c.method === "GET") {
      need(user, P.BOOKINGS_READ);
      return { data: stats() };
    }
    if (!a && c.method === "GET") {
      need(user, P.BOOKINGS_READ);
      const rows = BOOKINGS.filter(
        (r) =>
          (!c.query.project || r.project === c.query.project) &&
          (!c.query.status || r.status === c.query.status) &&
          matchText([r.customer.name, r.reference], c.query.search),
      ).map((r) => listItem(r, pii));
      return { data: paginate(rows, c.query) };
    }
    if (!a && c.method === "POST") {
      need(user, P.BOOKINGS_CREATE);
      return { status: 201, message: "Booking created", data: detail(createFromPayload(c.body as unknown as CreateBookingPayload), pii) };
    }
    const rec = BOOKINGS.find((r) => r.id === a);
    if (a && !rec) throw new HttpError(404, "Booking not found.");
    if (rec && c.method === "GET") {
      if (rec.ownerId !== user.id) need(user, P.BOOKINGS_READ);
      return { data: detail(rec, pii || rec.ownerId === user.id) };
    }
    if (rec && c.method === "PATCH") {
      need(user, P.BOOKINGS_UPDATE);
      const status = c.body.status as BookingStatus;
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) throw new HttpError(422, "Invalid status.");
      rec.status = status;
      return { message: "Booking updated", data: detail(rec, pii) };
    }
    throw new HttpError(404, "Not found");
  }

  if (root === "payments") {
    if (a === "summary" && c.method === "GET") {
      need(user, P.PAYMENTS_READ);
      return { data: paymentSummary() };
    }
    if (!a && c.method === "GET") {
      need(user, P.PAYMENTS_READ);
      const rows = PAYMENTS.filter(
        (p) =>
          (!c.query.project || p.project === c.query.project) &&
          (!c.query.kind || p.kind === c.query.kind) &&
          (!c.query.method || p.method === c.query.method) &&
          matchText([p.customerName, p.reference, p.receiptRef ?? ""], c.query.search),
      );
      return { data: paginate(rows, c.query) };
    }
    if (!a && c.method === "POST") {
      need(user, P.PAYMENTS_RECORD);
      return { status: 201, message: "Payment recorded", data: recordPayment(c.body as unknown as RecordPaymentPayload) };
    }
  }
  throw new HttpError(404, "Not found");
}

function createFromPayload(p: CreateBookingPayload): BookingRec {
  if (!p.customerName?.trim()) throw new HttpError(422, "Customer name is required.");
  if (!PROJECT_SLUGS.includes(p.project)) throw new HttpError(422, "Unknown project.");
  if (!(p.totalPrice > 0)) throw new HttpError(422, "Total price must be greater than zero.");
  if (!(p.units >= 1 && p.units <= MAX_UNITS_PER_BOOKING)) throw new HttpError(422, "Invalid number of units.");
  const rec = createRec({
    project: p.project,
    unitType: p.unitType,
    planId: p.planId,
    units: p.units,
    total: p.totalPrice,
    name: p.customerName.trim(),
    phone: p.phone,
    cnic: p.cnic,
    startDate: todayISO(),
  });
  return rec;
}

function recordPayment(p: RecordPaymentPayload): Payment {
  const rec = BOOKINGS.find((r) => r.id === p.bookingId);
  if (!rec) throw new HttpError(404, "Booking not found.");
  if (rec.status === "cancelled") throw new HttpError(409, "This booking is cancelled.");
  if (!(p.amount > 0)) throw new HttpError(422, "Amount must be greater than zero.");
  const outstanding = rec.totalPrice - rec.installments.reduce((s, i) => s + i.paidAmount, 0);
  if (p.amount > outstanding) throw new HttpError(422, `Amount exceeds the outstanding balance (${outstanding.toLocaleString("en-US")}).`);
  if (!p.receiptRef?.trim()) throw new HttpError(422, "Receipt reference is required.");
  if (PAYMENTS.some((x) => x.receiptRef?.toLowerCase() === p.receiptRef.trim().toLowerCase())) {
    throw new HttpError(409, "That receipt reference has already been used.");
  }
  const payment = applyPayment(rec, Math.round(p.amount), p.method, p.receiptRef.trim(), p.paidAt || todayISO());
  syncStatus(rec);
  return payment;
}

function stats(): BookingStats {
  const live = BOOKINGS.filter((b) => b.status !== "cancelled");
  const rooms = ROOMS.map((r) => {
    const booked = live.filter((b) => b.project === "nathia-gali" && b.unitType === r.slug).reduce((s, b) => s + b.units, 0);
    return { slug: r.slug, name: r.name, units: r.units, booked, available: r.units - booked };
  });
  const bookedUnits = rooms.reduce((s, r) => s + r.booked, 0);
  return {
    totals: {
      bookings: BOOKINGS.length,
      active: BOOKINGS.filter((b) => b.status === "confirmed").length,
      pending: BOOKINGS.filter((b) => b.status === "pending").length,
      cancelled: BOOKINGS.filter((b) => b.status === "cancelled").length,
      contractValue: live.reduce((s, b) => s + b.totalPrice, 0),
    },
    byProject: PROJECT_SLUGS.map((project) => {
      const rows = live.filter((b) => b.project === project);
      return { project, bookings: rows.length, value: rows.reduce((s, b) => s + b.totalPrice, 0) };
    }),
    inventory: {
      project: "nathia-gali",
      totalUnits: NATHIA_GALI_TOTAL_UNITS,
      bookedUnits,
      availableUnits: NATHIA_GALI_TOTAL_UNITS - bookedUnits,
      rooms,
    },
  };
}

function paymentSummary(): PaymentSummary {
  const today = todayISO();
  const soon = addDays(today, DUE_SOON_DAYS);
  const live = BOOKINGS.filter((b) => b.status !== "cancelled");
  const due: DueInstallment[] = [];
  let outstanding = 0;
  let overdueAmount = 0;
  let overdueCount = 0;
  let dueWeek = 0;
  for (const b of live) {
    for (const i of b.installments) {
      const open = i.amount - i.paidAmount;
      if (open <= 0) continue;
      outstanding += open;
      const status = instStatus(i, today);
      if (status === "overdue") {
        overdueAmount += open;
        overdueCount += 1;
      } else if (i.dueDate <= soon) dueWeek += open;
      if (status === "overdue" || i.dueDate <= soon) {
        due.push({
          bookingId: b.id,
          reference: b.reference,
          customerName: b.customer.name,
          project: b.project,
          no: i.no,
          label: i.no === 0 ? "Down payment" : `Instalment ${i.no}`,
          dueDate: i.dueDate,
          amount: open,
          status,
        });
      }
    }
  }
  due.sort((x, y) => (x.dueDate < y.dueDate ? -1 : 1));
  return {
    collected: PAYMENTS.reduce((s, p) => s + p.amount, 0),
    outstanding,
    overdueAmount,
    overdueCount,
    dueThisWeekAmount: dueWeek,
    collectedByProject: PROJECT_SLUGS.map((project) => ({
      project,
      collected: PAYMENTS.filter((p) => p.project === project).reduce((s, p) => s + p.amount, 0),
    })),
    dueInstallments: due.slice(0, 20),
  };
}

// ── fetch adapter ───────────────────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function mockFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const req = input instanceof Request ? input : new Request(String(input), init);
  await delay(LATENCY_MS);
  try {
    const match = req.url.match(/\/(auth|bookings|payments|public|stays|portfolio)(?:\/([^?]*))?(?:\?(.*))?$/);
    if (!match) throw new HttpError(404, "Not found");
    const seg = [match[1], ...(match[2] ? match[2].split("/") : [])];
    const query: Record<string, string> = {};
    (match[3] ?? "").split("&").filter(Boolean).forEach((pair) => {
      const [k, v = ""] = pair.split("=");
      query[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " "));
    });
    let body: Record<string, unknown> = {};
    if (req.method !== "GET" && req.method !== "HEAD") {
      const text = await req.text();
      body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    }
    const out = route({ method: req.method, seg, query, body, headers: req.headers });
    return json(out.status ?? 200, { success: true, message: out.message ?? "OK", data: out.data });
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    return json(status, { success: false, message: e instanceof Error ? e.message : "Mock server error", data: null });
  }
}

export const MOCK_LOGIN_HINT = "admin@serene.local";
