export type ApiEnvelope<T> = { success: boolean; message: string; data: T };

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AuthUser = { id: string; name: string; email: string; role: string };

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  permissions: string[];
};

export type MePayload = { user: AuthUser; permissions: string[] };
