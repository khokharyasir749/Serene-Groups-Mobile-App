import { router } from "expo-router";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { BookingForm } from "@/features/bookings/components/BookingForm";

export default function CreateBookingScreen() {
  return (
    <Screen title="New booking" onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
      <PermissionGate permission={P.BOOKINGS_CREATE} fallback="screen">
        <BookingForm />
      </PermissionGate>
    </Screen>
  );
}
