"use client";
import { useApi } from "src/hooks/useApi";
import { EventCard, EventCardSkeleton } from "src/components/events/event-card";
import { SERVER_BASE_URL } from "src/lib/services/services-config";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  dateTime: string;
}

export default function EventsPage() {
  const {
    data,
    error,
    isLoading,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useApi<any>(SERVER_BASE_URL + "/api/events?page=1&pageCount=10");

  const events = (data?.data as Event[]) ?? [];

  if (error) return <div>Failed to load events</div>;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : (
          events?.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
