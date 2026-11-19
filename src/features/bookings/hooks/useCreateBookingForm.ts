import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCreateBookingMutation } from "@/core/api/endpoints/bookingsApi";
import {
  CUSTOM_PLAN_ID,
  PLANS,
  SPU_PLAN_ID,
  UNIT_OPTIONS,
  type ProjectSlug,
} from "@/core/constants/serene";
import { parseError } from "@/core/lib/errorParser";
import { buildPlan } from "@/core/lib/plan";
import { toast } from "@/core/stores/uiStore";
import { bookingFormSchema, type BookingFormValues } from "../schemas/booking.schema";
import type { CreateBookingPayload } from "../types";

const DEFAULTS: BookingFormValues = {
  customerName: "",
  phone: "",
  cnic: "",
  project: "nathia-gali",
  planId: SPU_PLAN_ID,
  unitType: SPU_PLAN_ID,
  units: "1",
  customTotal: "",
};

/** Plans offered for a project: published presets (Nathia Gali) plus a custom amount. */
export const plansFor = (project: ProjectSlug) => PLANS.filter((p) => p.project === project);

function toPayload(v: BookingFormValues): CreateBookingPayload {
  const units = Number(v.units);
  const preset = PLANS.find((p) => p.id === v.planId);
  const total = preset ? preset.total * (v.planId === SPU_PLAN_ID ? units : 1) : Number((v.customTotal ?? "").replace(/,/g, ""));
  return {
    customerName: v.customerName.trim(),
    phone: v.phone.trim(),
    cnic: v.cnic.replace(/\D/g, "").replace(/^(\d{5})(\d{7})(\d)$/, "$1-$2-$3"),
    project: v.project,
    unitType: preset ? preset.id : v.unitType,
    planId: v.planId,
    units: v.planId === SPU_PLAN_ID || v.planId === CUSTOM_PLAN_ID ? units : 1,
    totalPrice: total,
  };
}

export function useCreateBookingForm() {
  const form = useForm<BookingFormValues>({ resolver: zodResolver(bookingFormSchema), defaultValues: DEFAULTS });
  const [create, { isLoading }] = useCreateBookingMutation();
  const values = useWatch({ control: form.control });

  const project = (values.project ?? DEFAULTS.project) as ProjectSlug;
  const planId = values.planId ?? DEFAULTS.planId;
  const isCustom = planId === CUSTOM_PLAN_ID;

  const preview = useMemo(() => {
    const parsed = bookingFormSchema.safeParse({ ...DEFAULTS, ...values, customerName: "xx", phone: "0300-1234567", cnic: "1234512345671" });
    return parsed.success ? buildPlan(toPayload(parsed.data).totalPrice) : null;
  }, [values]);

  const selectProject = (p: ProjectSlug) => {
    form.setValue("project", p);
    const first = plansFor(p)[0];
    form.setValue("planId", first ? first.id : CUSTOM_PLAN_ID);
    form.setValue("unitType", first ? first.id : UNIT_OPTIONS[p][0].id);
  };

  const selectPlan = (id: string) => {
    form.setValue("planId", id);
    if (id !== CUSTOM_PLAN_ID) form.setValue("unitType", id);
    else form.setValue("unitType", UNIT_OPTIONS[project][0].id);
  };

  const submit = form.handleSubmit(async (v) => {
    try {
      const booking = await create(toPayload(v)).unwrap();
      toast(`Booking ${booking.reference} created`, "success");
      router.replace({ pathname: "/booking/[id]", params: { id: booking.id } });
    } catch (e) {
      toast(parseError(e), "danger");
    }
  });

  return { form, project, planId, isCustom, preview, isLoading, selectProject, selectPlan, submit };
}
