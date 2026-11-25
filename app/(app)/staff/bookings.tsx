import { ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { useGetBookingStatsQuery, useListBookingsQuery } from "@/core/api/endpoints/bookingsApi";
import { DataList } from "@/core/components/DataList";
import { HeaderAction } from "@/core/components/FloatingHeader";
import { Input } from "@/core/components/Input";
import { Pager } from "@/core/components/Pager";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Pill } from "@/core/components/Pill";
import { Screen } from "@/core/components/Screen";
import { StatGrid } from "@/core/components/StatGrid";
import { P } from "@/core/constants/api";
import { spacing } from "@/core/constants/theme";
import { parseError } from "@/core/lib/errorParser";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import { SiteFilterPills } from "@/features/bookings/components/SiteFilterPills";
import { BOOKING_STATUSES, BOOKING_STATUS_META } from "@/features/bookings/components/statusMeta";
import { useBookingFilters } from "@/features/bookings/hooks/useBookingFilters";
import { useAuthStore } from "@/core/stores/authStore";

// Staff console: every booking, with search and filters. Reachable from the profile menu; not part of the visitor flow.
function StaffBookings() {
  const f = useBookingFilters();
  const { data, isLoading, isFetching, error, refetch } = useListBookingsQuery(f.args);
  const { data: stats } = useGetBookingStatsQuery();
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <Screen
      scroll={false}
      title="Bookings"
      onBack={back}
      right={<PermissionGate permission={P.BOOKINGS_CREATE}><HeaderAction icon={null} label="+ Book" onPress={() => router.push("/new-booking")} /></PermissionGate>}
    >
      <PermissionGate permission={P.BOOKINGS_READ} fallback="screen">
        <DataList
          data={data?.items}
          keyExtractor={(b) => b.id}
          renderItem={(b) => <BookingCard booking={b} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: b.id } })} />}
          loading={isLoading}
          error={error ? parseError(error) : null}
          onRetry={refetch}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          emptyTitle="No bookings found"
          emptyMessage="Try a different search or filter."
          header={
            <>
              <StatGrid short stats={[{ value: String(stats?.totals.bookings ?? "—"), label: "Bookings" }, { value: String(stats?.totals.pending ?? "—"), label: "Pending" }]} />
              <Input icon="search-outline" placeholder="Search name or reference" value={f.search} onChangeText={f.setSearch} />
              <SiteFilterPills value={f.project} onChange={f.setProject} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
                <Pill label="Any status" selected={f.status === undefined} onPress={() => f.setStatus(undefined)} />
                {BOOKING_STATUSES.map((s) => (
                  <Pill key={s} label={BOOKING_STATUS_META[s].label} selected={f.status === s} onPress={() => f.setStatus(s)} />
                ))}
              </ScrollView>
            </>
          }
          footer={data ? <Pager page={data.page} totalPages={data.totalPages} total={data.total} onChange={f.setPage} /> : null}
        />
      </PermissionGate>
    </Screen>
  );
}

// Staff consoles are signed-in only: signed-out visitors go to sign-in and come straight back here.
export default function StaffBookingsRoute() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  if (!authed) return <Redirect href={{ pathname: "/login", params: { next: "/staff/bookings" } }} />;
  return <StaffBookings />;
}
