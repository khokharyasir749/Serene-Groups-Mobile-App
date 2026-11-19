import { useState } from "react";
import { MAX_UNITS_PER_BOOKING, PLANS, SPU_PLAN_ID, projectName } from "@/core/constants/serene";

/** Web Investors <Calculator>: published plan × units (units only apply to Smart Property). */
export function useInvestorCalculator() {
  const [id, setId] = useState(PLANS[0].id);
  const [units, setUnits] = useState(1);
  const plan = PLANS.find((p) => p.id === id) ?? PLANS[0];
  const isSpu = plan.id === SPU_PLAN_ID;
  const qty = isSpu ? units : 1;

  const message = `Hello Serene Heights, I'm interested in ${qty > 1 ? `${qty} × ` : ""}the ${plan.area} sq ft ${plan.kind} at ${projectName(plan.project)}. Please share the payment plan.`;

  return {
    plans: PLANS,
    plan,
    isSpu,
    qty,
    units,
    select: (planId: string) => {
      setId(planId);
      setUnits(1);
    },
    more: () => setUnits((u) => Math.min(MAX_UNITS_PER_BOOKING, u + 1)),
    fewer: () => setUnits((u) => Math.max(1, u - 1)),
    canMore: units < MAX_UNITS_PER_BOOKING,
    canFewer: units > 1,
    total: plan.total * qty,
    down: plan.down * qty,
    monthly: plan.monthly * qty,
    message,
  };
}
