import { useMemo, useState } from "react";
import type { ProjectSlug } from "@/core/constants/serene";
import { useDebounce } from "@/core/hooks/useDebounce";
import type { PaymentFilters, PaymentKind, PaymentMethod } from "../types";

const PAGE_SIZE = 8;

export function usePaymentFilters() {
  const [search, setSearch] = useState("");
  const [project, setProject] = useState<ProjectSlug | undefined>();
  const [kind, setKind] = useState<PaymentKind | undefined>();
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search.trim());

  const args = useMemo<PaymentFilters>(
    () => ({ page, limit: PAGE_SIZE, search: debounced || undefined, project, kind, method }),
    [page, debounced, project, kind, method],
  );
  // Any filter change returns to page 1.
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  return {
    args,
    search,
    project,
    kind,
    method,
    setPage,
    setSearch: reset(setSearch),
    setProject: reset(setProject),
    setKind: reset(setKind),
    setMethod: reset(setMethod),
  };
}

export type PaymentFilterState = ReturnType<typeof usePaymentFilters>;
