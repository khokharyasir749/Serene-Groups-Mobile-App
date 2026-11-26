/** Up to two letters for a guest's round badge. */
export const initialsOf = (name: string) =>
  name.split(" ").map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c ?? "")).slice(0, 2).join("").toUpperCase() || "G";
