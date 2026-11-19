import { useMemo, useState } from "react";
import { CUSTOM_PLAN_ID, MAX_UNITS_PER_BOOKING, PLANS, PLAN_RULES, SPU_PLAN_ID, projectName } from "@/core/constants/serene";
import { formatPKR } from "@/core/lib/formatPKR";
import { buildPlan, planSum } from "@/core/lib/plan";

/** 30% down + 36 monthly instalments. The final instalment absorbs rounding so the sum is exactly the total. */
export function usePlanCalculator() {
  const [planId, setPlanId] = useState<string>(PLANS[0].id);
  const [custom, setCustom] = useState("");
  const [units, setUnits] = useState(1);

  const preset = PLANS.find((p) => p.id === planId);
  const isCustom = planId === CUSTOM_PLAN_ID;
  const isSpu = planId === SPU_PLAN_ID;
  const qty = isSpu ? units : 1;

  const total = useMemo(() => {
    if (isCustom) {
      const n = Number(custom.replace(/,/g, ""));
      return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
    }
    return (preset?.total ?? 0) * qty;
  }, [isCustom, custom, preset, qty]);

  const plan = useMemo(() => {
    const p = buildPlan(total);
    if (planSum(p) !== p.total) throw new Error(`Plan maths drifted: ${planSum(p)} !== ${p.total}`);
    return p;
  }, [total]);

  const message = isCustom
    ? `Hello Serene Heights, please share a payment plan for ${formatPKR(total)} (${PLAN_RULES.downPercent}% down, then ${PLAN_RULES.months} monthly instalments).`
    : `Hello Serene Heights, I'm interested in ${qty > 1 ? `${qty} × ` : ""}the ${preset?.area} sq ft ${preset?.kind} at ${projectName(preset?.project ?? "nathia-gali")}. Please share the payment plan.`;

  return {
    planId,
    select: (id: string) => {
      setPlanId(id);
      setUnits(1);
    },
    custom,
    setCustom,
    isCustom,
    isSpu,
    units,
    more: () => setUnits((u) => Math.min(MAX_UNITS_PER_BOOKING, u + 1)),
    fewer: () => setUnits((u) => Math.max(1, u - 1)),
    canMore: units < MAX_UNITS_PER_BOOKING,
    canFewer: units > 1,
    total,
    plan,
    message,
  };
}
