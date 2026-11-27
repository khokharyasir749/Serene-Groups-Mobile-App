import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, TextInput, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/features/services/components/Text";
import { CLEARANCE, colors, spacing } from "@/core/constants/theme";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { BilledGrid, billedCard, type BilledCard } from "@/features/services/components/BilledGrid";
import { Fold } from "@/features/services/components/Fold";
import { CareFeature } from "@/features/services/components/CareFeature";
import { Closing } from "@/features/services/components/Closing";
import { Curtain, CurtainEnd, type CurtainPanel } from "@/features/services/components/Curtain";
import { CareTiles, careTile, type CareTile } from "@/features/services/components/CareGrid";
import { FrontDesk, callDesk } from "@/features/services/components/FrontDesk";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { PackageRail } from "@/features/services/components/PackageRail";
import { Headline, Rise } from "@/features/services/components/scroll";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { tone } from "@/features/services/components/tone";
import { GroupsBack, Heading, Press, RoundButton, Surface, SurfacePress } from "@/features/services/components/ui";
import { HOME_COVER, ISSUE_PHOTO, PACKAGES, PANEL_PHOTO, inGroup, searchServices, serviceBySlug } from "@/features/services/data/catalog";
import { BASE, openCategory } from "@/features/services/lib/nav";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";

const COMFORT = inGroup("comfort");
const ISSUES: CareTile[] = inGroup("issue").map(careTile);
const CARE: CareTile[] = ["towels", "pillows", "wake-up", "room-refresh"].map((slug) => careTile(COMFORT.find((s) => s.slug === slug)!));
const by = (slug: string) => billedCard([...inGroup("dining"), ...inGroup("wellness")].find((s) => s.slug === slug)!);
const BILLED: BilledCard[] = ["breakfast", "restaurant", "laundry", "minibar"].map(by);
/** The three the page stops for; the rest follow in a grid. */
const PANELS: CurtainPanel[] = ["room-service", "spa", "transfer"].map((slug) => {
  const c = by(slug);
  return { key: slug, photo: PANEL_PHOTO[slug] ?? c.photo, over: c.line, name: c.name, cta: c.verb, onOpen: c.onPress };
});
const MORE: CurtainPanel[] = BILLED.map((c) => ({ key: c.key, photo: PANEL_PHOTO[c.key] ?? c.photo, over: c.line, name: c.name, cta: c.verb, onOpen: c.onPress }));
const SHORTCUTS: { slug: "comfort" | "dining" | "wellness" | "issue"; label: string; icon: ServiceIconName }[] = [
  { slug: "comfort", label: "Housekeeping", icon: "towels" },
  { slug: "dining", label: "Dining", icon: "dining" },
  { slug: "wellness", label: "Wellness", icon: "spa" },
  { slug: "issue", label: "Room issue", icon: "maintenance" },
];

/** The four sides of the concierge, one tap away. */
function Shortcuts() {
  return (
    <View style={styles.shortcuts}>
      {SHORTCUTS.map((x, i) => (
        <Enter key={x.slug} order={i + 4} style={styles.fill}>
          <Press onPress={() => openCategory(x.slug)} accessibilityLabel={x.label} style={styles.shortcut}>
            <IconWell name={x.icon} size={58} />
            <Text style={styles.shortcutText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.1}>
              {x.label}
            </Text>
          </Press>
        </Enter>
      ))}
    </View>
  );
}
const HEAD = 67; // a heading and the gap under it

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export default function Home() {
  const { height } = useWindowDimensions();
  const room = useServicesStore((s) => s.room);
  const requests = useServicesStore((s) => s.requests);
  const active = requests.filter(isActive);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  // The top of the page comes first; what is below the fold is built once it has been drawn.
  const [rest, setRest] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRest(true), 300);
    return () => clearTimeout(t);
  }, []);
  const searching = searchOpen && query.trim().length > 0;
  const results = searching ? searchServices(query) : [];
  const extras = results.filter((r) => r.kind === "extra").map(billedCard);
  const care = results.filter((r) => r.kind === "care").map(careTile);
  const closeSearch = () => {
    Keyboard.dismiss();
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <HeroPage
      photo={HOME_COVER}
      position="top"
      title={room || "Your stay"}
      height={Math.round(Math.min(Math.max(height * 0.7, 500), 680))}
      bottom={CLEARANCE}
      action={<RoundButton icon="call-outline" label="Call Front Desk" onPress={callDesk} size={40} />}
      bar={
        <>
          <View style={styles.fill}>
            <BrandLockup sub="SERVICES" onPhoto />
          </View>
          <GroupsBack onPhoto />
        </>
      }
      foot={
        <View style={styles.greet}>
          <View>
            <Enter order={1}>
              <Text style={styles.over}>{greeting()}</Text>
            </Enter>
            <Headline mount key={room} text={room || "Your stay"} style={styles.room} />
          </View>
          <Enter order={5} style={styles.tools}>
            <RoomPicker compact onPhoto />
            <RoundButton finish="clear" icon={searchOpen ? "close-outline" : "search-outline"} label={searchOpen ? "Close search" : "Search services"} size={44} onPress={() => (searchOpen ? closeSearch() : setSearchOpen(true))} />
          </Enter>
        </View>
      }
    >
        {searchOpen ? (
          <Enter dy={-10}>
          <Surface finish="glass" radius={18} style={styles.search}>
            <Ionicons name="search-outline" size={19} color={tone.ink} />
            <TextInput value={query} onChangeText={setQuery} autoFocus placeholder="What can we bring you?" placeholderTextColor={tone.soft} style={styles.input} returnKeyType="search" onSubmitEditing={Keyboard.dismiss} accessibilityLabel="Search services" />
          </Surface>
          </Enter>
        ) : null}

        {searching ? (
          <>
            <Heading>{results.length ? `${results.length} found` : "Nothing found"}</Heading>
            {care.length ? <CareTiles tiles={care} /> : null}
            {extras.length ? <BilledGrid cards={extras} /> : null}
            {results.length ? null : <FrontDesk />}
          </>
        ) : (
          <>
            <Shortcuts />
            <Reveal>
              <FrontDesk />
            </Reveal>
            {active.length ? (
              <Enter order={1}>
              <SurfacePress radius={18} onPress={() => router.navigate(`${BASE}/my-bookings`)} style={styles.active} accessibilityLabel={`${active.length} active requests. View`}>
                <IconWell name={serviceBySlug(active[0].slug)?.icon ?? "message"} size={48} />
                <View style={styles.fill}>
                  <Text style={styles.activeName} numberOfLines={1}>
                    {active[0].name}
                  </Text>
                  <Text style={styles.activeLine}>{active.length === 1 ? "1 active request" : `${active.length} active requests`}</Text>
                </View>
                <Ionicons name="chevron-forward" size={17} color={tone.soft} />
              </SurfacePress>
              </Enter>
            ) : null}
            <Reveal plain style={styles.block}>
              <Heading action="All" onAction={() => openCategory("comfort")}>With our compliments</Heading>
              <CareTiles tiles={CARE} at={HEAD} />
            </Reveal>
            {rest ? (
              <>
                <Reveal plain>
                  <Heading>Billed to your room</Heading>
                </Reveal>
                <Curtain panels={PANELS} tall={0.72} />
                <CurtainEnd>
                <Reveal plain style={styles.block}>
                  <Heading>Explore</Heading>
                  <View style={styles.folds}>
                    <Fold first icon="room-service" title="More for your stay" note={`${BILLED.length} services · Billed to your room`}>
                      <Curtain loose panels={MORE} tall={0.72} />
                    </Fold>
                    <Fold icon="spa" title="Curated stays" note={`${PACKAGES.length} stays · Price on request`}>
                      <PackageRail />
                    </Fold>
                    <Fold icon="maintenance" title="Room issues" note="Complimentary · We come to you">
                      <CareFeature photo={ISSUE_PHOTO} position="bottom" title="We come to you" onOpen={() => openCategory("issue")} tiles={ISSUES} />
                    </Fold>
                  </View>
                </Reveal>
                <Closing />
                </CurtainEnd>
              </>
            ) : null}
          </>
        )}
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  greet: { gap: 16 },
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 2 },
  // Upright, like the names on the photo cards below: steady letters, figures level with the capitals.
  room: { ...type.hero, fontFamily: sf.displayMedium, fontSize: 62, lineHeight: 64, letterSpacing: -1.4, color: colors.white },
  tools: { flexDirection: "row", alignItems: "center", gap: 9 },
  shortcuts: { flexDirection: "row", gap: 2, marginBottom: -12 },
  shortcut: { alignItems: "center", gap: 10 },
  shortcutText: { ...type.label, fontSize: 12, letterSpacing: 0, color: tone.ink, textAlign: "center" },
  folds: {},
  block: { gap: 18 },
  fill: { flex: 1 },
  active: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 16 },
  activeName: { ...type.button, color: tone.ink },
  activeLine: { ...type.label, color: tone.soft },
  search: { flexDirection: "row", alignItems: "center", gap: 10, height: 52, paddingHorizontal: 18 },
  input: { flex: 1, height: 52, color: tone.ink, fontSize: 15, fontFamily: sf.ui },
});
