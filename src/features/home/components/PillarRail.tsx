import { router } from "expo-router";
import { TileRail, type Tile } from "@/core/components/TileRail";
import { P } from "@/core/constants/api";
import { usePermissions } from "@/core/hooks/usePermissions";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { switchTo } from "@/core/stores/switchStore";
import { useScrollTo } from "./scrollTarget";

/** Every way in, numbered: the two mini-apps, the staff workspace, investing, projects and the concierge. */
export function PillarRail() {
  const { has } = usePermissions();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const toProjects = useScrollTo("upcoming");
  const manage = () => {
    if (has(P.BOOKINGS_READ)) router.push("/staff/bookings");
    else if (authed) router.navigate("/profile");
    else router.push({ pathname: "/login", params: { next: "/staff/bookings" } });
  };
  const tiles: Tile[] = [
    { label: "Bookings", icon: "bed", go: () => switchTo("Serene Bookings", () => router.push("/serene-bookings")) },
    { label: "Services", icon: "room-service", go: () => switchTo("Serene Services", () => router.push("/serene-services")) },
    { label: "Manage", icon: "key-variant", go: manage },
    { label: "Invest", icon: "finance", go: () => router.navigate("/payments") },
    { label: "Projects", icon: "floor-plan", go: toProjects },
    { label: "Concierge", icon: "whatsapp", go: () => void openWhatsApp() },
  ];
  return <TileRail tiles={tiles} />;
}
