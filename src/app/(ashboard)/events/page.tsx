"use client";

import { useApi } from "src/hooks/useApi";
import { EventCard, EventCardSkeleton } from "src/components/events/event-card";
import type { IEvent } from "src/types/event-type";

type Response = {
  data: IEvent[];
};

const EventsListPage = () => {
  //fetch events
  const { data, error, isLoading } = useApi<Response>(
    "/api/events?page=1&pageCount=10"
  );
  const events = data?.data ?? [];

  if (error) return <div>Failed to load events</div>;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>
      {error ? (
        <div className="text-center py-8 text-destructive">
          Failed to load events
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : (
            events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EventsListPage;
