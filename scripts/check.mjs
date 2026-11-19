// Automated rule verifier — `npm run check`. Exits 1 if any architecture / domain rule is broken.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
// Waves unlock more required files. Bump as each wave lands; the finished app is wave 4.
const CURRENT_WAVE = 4;

const errors = [];
const fail = (rule, msg) => errors.push(`[${rule}] ${msg}`);
const rel = (p) => relative(ROOT, p).split(sep).join("/");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

// ── 1. Required files ──────────────────────────────────────────────────────────────────────────
const REQUIRED = [
  [1, "app/_layout.tsx"],
  [1, "app/(auth)/_layout.tsx"],
  [1, "app/(auth)/login.tsx"],
  [1, "app/(app)/_layout.tsx"],
  [1, "app/(app)/(tabs)/_layout.tsx"],
  [1, "app/(app)/(tabs)/index.tsx"],
  [1, "app/(app)/(tabs)/bookings/index.tsx"],
  [1, "app/(app)/booking/[id].tsx"],
  [1, "app/(app)/new-booking.tsx"],
  [1, "app/(app)/(tabs)/payments/index.tsx"],
  [1, "app/(app)/calculator.tsx"],
  [1, "app/(app)/record-payment.tsx"],
  [1, "src/core/api/baseApi.ts"],
  [1, "src/core/api/mockServer.ts"],
  [1, "src/core/api/endpoints/authApi.ts"],
  [1, "src/core/api/endpoints/bookingsApi.ts"],
  [1, "src/core/api/endpoints/paymentsApi.ts"],
  [1, "src/core/api/types/api.ts"],
  [1, "src/core/auth/secureStore.ts"],
  [1, "src/core/auth/session.ts"],
  [1, "src/core/constants/api.ts"],
  [1, "src/core/constants/serene.ts"],
  [1, "src/core/constants/theme.ts"],
  ...["Screen", "Card", "Pill", "Button", "Input", "EmptyState", "DataList", "PermissionGate"].map((c) => [1, `src/core/components/${c}.tsx`]),
  ...["usePermissions", "useDebounce", "useAppStateRefresh"].map((h) => [1, `src/core/hooks/${h}.ts`]),
  ...["formatPKR", "formatDate", "errorParser", "deviceInfo", "whatsappShare"].map((l) => [1, `src/core/lib/${l}.ts`]),
  [1, "src/core/stores/authStore.ts"],
  [1, "src/core/stores/uiStore.ts"],
  [1, "src/features/bookings/components/BookingCard.tsx"],
  [1, "src/features/bookings/components/SiteFilterPills.tsx"],
  [1, "src/features/bookings/components/UnitAvailabilityBadge.tsx"],
  [1, "src/features/bookings/hooks/useBookingFilters.ts"],
  [1, "src/features/bookings/hooks/useCreateBookingForm.ts"],
  [1, "src/features/bookings/schemas/booking.schema.ts"],
  [1, "src/features/bookings/types.ts"],
  [1, ".env.example"],
  [2, "src/features/payments/components/PaymentRow.tsx"],
  [2, "src/features/payments/components/PlanBreakdownCard.tsx"],
  [2, "src/features/payments/hooks/usePlanCalculator.ts"],
  [2, "src/features/payments/hooks/useRecordPaymentForm.ts"],
  [2, "src/features/payments/schemas/payment.schema.ts"],
  [2, "src/features/payments/types.ts"],
  [3, "src/features/payments/components/InstallmentScheduleList.tsx"],
  [3, "src/features/payments/hooks/usePaymentFilters.ts"],
  [4, "scripts/check.mjs"],
];
for (const [wave, f] of REQUIRED) {
  if (wave <= CURRENT_WAVE && !existsSync(join(ROOT, f))) fail("required-file", `missing ${f}`);
}

// ── 2. Unit inventory math (serene.ts) ─────────────────────────────────────────────────────────
const serenePath = join(ROOT, "src/core/constants/serene.ts");
if (existsSync(serenePath)) {
  const src = readFileSync(serenePath, "utf8");
  const block = src.match(/export const ROOMS = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  const units = [...block.matchAll(/units:\s*(\d+)/g)].map((m) => Number(m[1]));
  const declared = Number(src.match(/NATHIA_GALI_TOTAL_UNITS\s*=\s*(\d+)/)?.[1]);
  const sum = units.reduce((a, b) => a + b, 0);
  if (units.length !== 5) fail("inventory", `expected 5 Nathia Gali room types, found ${units.length}`);
  if (sum !== declared) fail("inventory", `room units sum to ${sum} but NATHIA_GALI_TOTAL_UNITS is ${declared}`);
  if (!/assertInvariants\(\);/.test(src)) fail("inventory", "serene.ts must call assertInvariants() at load");
  const rules = src.match(/PLAN_RULES = \{ downPercent: (\d+), months: (\d+) \}/);
  if (!rules) fail("plan-rules", "PLAN_RULES { downPercent, months } missing from serene.ts");
}

// ── 3 / 4 / 5. Source scans ────────────────────────────────────────────────────────────────────
const MAGIC = [
  "2250000", "26680000", "26920000", "29360000", "675000", "8004000", "8076000", "8808000",
  "43750", "518778", "523444", "570889", "2_250_000", "26_680_000", "26_920_000", "29_360_000",
  "675_000", "8_004_000", "8_076_000", "8_808_000", "43_750", "518_778", "523_444", "570_889",
];
const MAGIC_RES = [...MAGIC.map((n) => new RegExp(`(?<![\\w.])${n}(?![\\w])`)), /(?<![\w.#])36(?![\w%])/, /(?<![\w.#])130(?![\w%])/];
const files = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "src"))];

for (const file of files) {
  const r = rel(file);
  const raw = readFileSync(file, "utf8");
  const code = stripComments(raw);
  const isSerene = r === "src/core/constants/serene.ts";
  const isTheme = r === "src/core/constants/theme.ts";

  if (!isTheme && /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/.test(code)) {
    fail("hex-color", `${r}: hex colour outside theme.ts`);
  }
  if (!isSerene && !isTheme) {
    for (const re of MAGIC_RES) {
      const m = code.match(re);
      if (m) fail("magic-number", `${r}: hard-coded plan/unit number ${m[0]} (use serene.ts)`);
    }
  }
  const inRoutesOrFeatures = r.startsWith("app/") || r.startsWith("src/features/");
  if (inRoutesOrFeatures && (/\bfetch\s*\(/.test(code) || /\baxios\b/.test(code))) {
    fail("transport", `${r}: raw fetch/axios outside baseApi.ts/session.ts`);
  }
  if (r.startsWith("app/")) {
    const lines = raw.split("\n").length;
    if (lines > 120) fail("route-size", `${r}: ${lines} lines (max 120)`);
    if (/from\s+["']zod["']/.test(code)) fail("route-zod", `${r}: routes must not import zod`);
  }
  if (r.startsWith("app/(app)/(tabs)/") && !/_layout\.tsx$/.test(r) && !/PermissionGate|usePermissions/.test(code)) {
    fail("permissions", `${r}: tab screen has no usePermissions()/<PermissionGate> check`);
  }
  if (r === "app/(app)/(tabs)/_layout.tsx" && !/usePermissions/.test(code)) fail("permissions", `${r}: tabs must be gated via usePermissions()`);
  if (r.startsWith("src/") && !["src/core/api/baseApi.ts", "src/core/auth/session.ts"].includes(r) && /AsyncStorage/.test(code)) {
    fail("storage", `${r}: AsyncStorage is forbidden (use expo-secure-store)`);
  }
}

// Transport must stay in the two blessed files.
const baseApi = join(ROOT, "src/core/api/baseApi.ts");
if (existsSync(baseApi)) {
  const s = readFileSync(baseApi, "utf8");
  for (const h of ["DEVICE_HEADER", "PLATFORM_HEADER", "authorization"]) {
    if (!s.includes(h)) fail("baseApi", `baseApi.ts missing ${h}`);
  }
}

if (errors.length) {
  console.error(`\n✖ check failed (${errors.length})\n` + errors.map((e) => `  ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`✔ check passed (wave ${CURRENT_WAVE}, ${files.length} source files scanned)`);
