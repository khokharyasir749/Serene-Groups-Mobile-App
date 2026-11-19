import { useMemo, useState } from "react";
import type { ProjectSlug } from "@/core/constants/serene";
import { useDebounce } from "@/core/hooks/useDebounce";
import type { BookingFilters, BookingStatus } from "../types";

const PAGE_SIZE = 8;

export function useBookingFilters() {
  const [search, setSearch] = useState("");
  const [project, setProject] = useState<ProjectSlug | undefined>();
  const [status, setStatus] = useState<BookingStatus | undefined>();
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search.trim());

  // Any filter change returns to page 1.
  const args = useMemo<BookingFilters>(
    () => ({ page, limit: PAGE_SIZE, search: debounced || undefined, project, status }),
    [page, debounced, project, status],
  );

  return {
    args,
    search,
    project,
    status,
    page,
    setPage,
    setSearch: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    setProject: (v: ProjectSlug | undefined) => {
      setProject(v);
      setPage(1);
    },
    setStatus: (v: BookingStatus | undefined) => {
      setStatus(v);
      setPage(1);
    },
  };
}
