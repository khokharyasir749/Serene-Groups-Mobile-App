import { router } from "expo-router";
import { FadeIn } from "@/core/components/FadeIn";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { WealthCalculator } from "@/features/payments/components/WealthCalculator";

export default function CalculatorScreen() {
  return (
    <Screen title="Wealth calculator" onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
      <PermissionGate permission={P.PAYMENTS_READ} fallback={<WealthCalculator />}>
        <FadeIn>
          <WealthCalculator />
        </FadeIn>
      </PermissionGate>
    </Screen>
  );
}
