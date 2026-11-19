import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { clearBiometricAccount, getBiometricAccount, setBiometricAccount, type BiometricAccount } from "@/core/auth/secureStore";

/** Device fingerprint / face support: hardware present and at least one biometric enrolled. */
export async function biometricsAvailable(): Promise<boolean> {
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

/**
 * Returning-user fingerprint sign-in. `account` exists only after someone signed in on this device and chose to enable it,
 * so first-time users never see the fingerprint option.
 */
export function useBiometric() {
  const [available, setAvailable] = useState(false);
  const [account, setAccount] = useState<BiometricAccount | null>(null);

  const refresh = useCallback(async () => {
    setAvailable(await biometricsAvailable());
    setAccount(await getBiometricAccount());
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Ask once, right after a successful password sign-in, whether to remember this account for fingerprint unlock. */
  const offerToRemember = useCallback(
    async (next: BiometricAccount) => {
      if (!(await biometricsAvailable())) return;
      const saved = await getBiometricAccount();
      if (saved?.email === next.email && saved.password === next.password) return;
      Alert.alert("Enable fingerprint sign-in?", `Next time, unlock ${next.email} with your fingerprint on this device.`, [
        { text: "Not now", style: "cancel" },
        {
          text: "Enable",
          onPress: () => {
            void setBiometricAccount(next).then(refresh);
          },
        },
      ]);
    },
    [refresh],
  );

  /** Prompts the device biometric; resolves to the remembered credentials only on success. */
  const unlock = useCallback(async (): Promise<BiometricAccount | null> => {
    if (!account) return null;
    try {
      const res = await LocalAuthentication.authenticateAsync({ promptMessage: `Unlock ${account.email}`, cancelLabel: "Use password" });
      return res.success ? account : null;
    } catch {
      return null;
    }
  }, [account]);

  const forget = useCallback(async () => {
    await clearBiometricAccount();
    await refresh();
  }, [refresh]);

  return { available, account, offerToRemember, unlock, forget, refresh };
}
