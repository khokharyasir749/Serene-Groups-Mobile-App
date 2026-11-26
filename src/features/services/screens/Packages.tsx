import { StyleSheet, View, useWindowDimensions } from "react-native";
import { CLEARANCE, colors } from "@/core/constants/theme";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { Closing } from "@/features/services/components/Closing";
import { Curtain, CurtainEnd, type CurtainPanel } from "@/features/services/components/Curtain";
import { FrontDesk } from "@/features/services/components/FrontDesk";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { Headline } from "@/features/services/components/scroll";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { GroupsBack } from "@/features/services/components/ui";
import { PACKAGES, STAYS_COVER } from "@/features/services/data/catalog";
import { openBook, openService } from "@/features/services/lib/nav";

const PANELS: CurtainPanel[] = PACKAGES.map((s) => ({
  key: s.slug, photo: s.photo, over: s.line.replace(/\.$/, ""), name: s.name, lines: s.includes, cta: "Request", ctaLabel: `Request ${s.name}`, onOpen: () => openService(s.slug), onCta: () => openBook(s.slug),
}));

/** Stay packages as curtains: each photograph is drawn over the one before. */
export default function Packages() {
  const { height } = useWindowDimensions();
  return (
    <HeroPage
      photo={STAYS_COVER}
      title="Curated stays"
      height={Math.round(Math.min(Math.max(height * 0.56, 380), 520))}
      bottom={CLEARANCE}
      bar={
        <>
          <View style={styles.fill}>
            <BrandLockup sub="SERVICES" onPhoto />
          </View>
          <GroupsBack onPhoto />
        </>
      }
      foot={<Headline mount text="Curated stays" style={styles.title} />}
    >
      <Text style={styles.line}>Arranged by the Front Desk.</Text>
      <Curtain panels={PANELS} />
      <CurtainEnd>
        <Reveal>
          <FrontDesk />
        </Reveal>
        <Closing />
      </CurtainEnd>
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  title: { ...type.hero, fontSize: 48, lineHeight: 56, color: colors.white },
  line: { ...type.lead, color: tone.ink },
});
