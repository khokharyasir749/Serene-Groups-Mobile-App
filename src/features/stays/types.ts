export type StayStatus = "requested" | "confirmed";

export type Stay = {
  id: string;
  reference: string;
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  status: StayStatus;
  createdAt: string;
};

export type ReservePayload = { roomSlug: string; checkIn: string; checkOut: string; adults: number };
