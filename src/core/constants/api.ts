// Endpoint paths, RTK Query tag types and permission keys.

export const ENDPOINTS = {
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  bookings: "/bookings",
  bookingStats: "/bookings/stats",
  booking: (id: string) => `/bookings/${id}`,
  payments: "/payments",
  paymentSummary: "/payments/summary",
  availability: "/public/availability",
  otpRequest: "/auth/otp/request",
  otpVerify: "/auth/otp/verify",
  stays: "/stays",
  myStays: "/stays/mine",
  portfolio: "/portfolio/me",
} as const;

export const TAGS = {
  Auth: "Auth",
  Booking: "Booking",
  BookingStats: "BookingStats",
  Payment: "Payment",
  PaymentSummary: "PaymentSummary",
  Availability: "Availability",
  Stay: "Stay",
  Portfolio: "Portfolio",
} as const;

export const TAG_TYPES = [TAGS.Auth, TAGS.Booking, TAGS.BookingStats, TAGS.Payment, TAGS.PaymentSummary, TAGS.Availability, TAGS.Stay, TAGS.Portfolio] as const;

/** Permission keys, `resource:action`. Gate every tab, screen and action with these. */
export const P = {
  DASHBOARD_READ: "dashboard:read",
  BOOKINGS_READ: "bookings:read",
  BOOKINGS_CREATE: "bookings:create",
  BOOKINGS_UPDATE: "bookings:update",
  PAYMENTS_READ: "payments:read",
  PAYMENTS_RECORD: "payments:record",
  /** Without this the server masks customer phone + CNIC (they arrive as null). */
  CUSTOMERS_PII: "customers:pii",
  /** A signed-in guest can reserve stays and see their own. */
  MY_STAYS: "stays:mine",
  /** An investor can see their own holdings, instalments and receipts. */
  PORTFOLIO_READ: "portfolio:read",
} as const;

export type Permission = (typeof P)[keyof typeof P];
export const ALL_PERMISSIONS: readonly Permission[] = Object.values(P);

export const DEVICE_HEADER = "x-device-id";
export const PLATFORM_HEADER = "x-platform";
