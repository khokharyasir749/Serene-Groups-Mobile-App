import { useState } from "react";
import { useLoginMutation } from "@/core/api/endpoints/authApi";
import { isMockMode } from "@/core/auth/session";
import { parseError } from "@/core/lib/errorParser";
import { useBiometric } from "./useBiometric";

/** Email/password sign-in plus the returning-user fingerprint path. */
export function useLoginFlow() {
  // Mock mode pre-fills the admin test account so one tap on Sign in works.
  const [email, setEmail] = useState(isMockMode ? "admin@serene.local" : "");
  const [password, setPassword] = useState(isMockMode ? "demo" : "");
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const bio = useBiometric();

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) return setError("Enter your email and password.");
    const creds = { email: email.trim().toLowerCase(), password };
    try {
      await login(creds).unwrap();
      void bio.offerToRemember(creds);
    } catch (e) {
      setError(parseError(e));
    }
  };

  const unlock = async () => {
    setError(null);
    const saved = await bio.unlock();
    if (!saved) return;
    try {
      await login({ email: saved.email, password: saved.password }).unwrap();
    } catch (e) {
      setError(parseError(e));
    }
  };

  const fill = (e: string) => {
    setEmail(e);
    setPassword("demo");
    setError(null);
  };

  return { email, setEmail, password, setPassword, error, isLoading, submit, unlock, fill, bio };
}
