import { useState } from "react";
import { useRequestOtpMutation, useVerifyOtpMutation } from "@/core/api/endpoints/authApi";
import { parseError } from "@/core/lib/errorParser";
import { guestDetailsSchema, otpCodeSchema } from "../schemas/guest.schema";

/** Guest sign-in by mobile number: details → one-time code → signed in (no password to remember). */
export function useGuestAuth(onSignedIn: () => void) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"details" | "code">("details");
  const [error, setError] = useState<string | null>(null);
  const [requestOtp, { isLoading: sending }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

  const sendCode = async () => {
    const parsed = guestDetailsSchema.safeParse({ name, phone });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Check your details");
    setError(null);
    try {
      await requestOtp({ phone: parsed.data.phone }).unwrap();
      setStep("code");
    } catch (e) {
      setError(parseError(e));
    }
  };

  const verify = async () => {
    const parsedCode = otpCodeSchema.safeParse(code);
    if (!parsedCode.success) return setError(parsedCode.error.issues[0]?.message ?? "Enter the code");
    setError(null);
    try {
      await verifyOtp({ phone: phone.trim(), code: parsedCode.data, name: name.trim() }).unwrap();
      onSignedIn();
    } catch (e) {
      setError(parseError(e));
    }
  };

  return { name, setName, phone, setPhone, code, setCode, step, back: () => setStep("details"), error, sendCode, verify, busy: sending || verifying };
}
