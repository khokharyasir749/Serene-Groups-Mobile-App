import { router, type Href } from "expo-router";
import { switchTo } from "@/core/stores/switchStore";
import type { Service } from "@/features/services/data/catalog";
import { openCare } from "@/features/services/store/useDeskSheet";

export const BASE = "/serene-services";
const LOCK_MS = 450;
let lockedUntil = 0;

/** A second tap while a screen is opening is ignored. */
function push(href: Href) {
  const now = Date.now();
  if (now < lockedUntil) return;
  lockedUntil = now + LOCK_MS;
  router.push(href);
}

export const openCategory = (slug: string) => push({ pathname: "/serene-services/category/[slug]", params: { slug } });
export const openService = (slug: string) => push({ pathname: "/serene-services/service/[slug]", params: { slug } });
export const openBook = (slug: string) => push({ pathname: "/serene-services/book/[slug]", params: { slug } });
/** Extras open their page; complimentary care opens the one-tap sheet. */
export const openAny = (s: Service) => (s.kind === "care" ? openCare(s.slug) : openService(s.slug));
export const goBack = () => (router.canGoBack() ? router.back() : router.replace(BASE));

/** From a pushed page back to one of the module's tabs. */
export function toTab(path: "" | "/my-bookings") {
  if (router.canDismiss()) router.dismissAll();
  setTimeout(() => router.navigate(`${BASE}${path}` as Href), 60);
}

/** Leaves Serene Services for the Groups app. */
export const exitToGroups = () => switchTo("Serene Groups", () => router.dismissTo("/"));
