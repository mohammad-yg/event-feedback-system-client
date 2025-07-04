"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";
import { EventCard, EventCardSkeleton } from "src/components/events/event-card";
import { useApi } from "src/hooks/useApi";
import type { IEvent } from "src/types/event-type";

interface Response {
  registeredEvents: IEvent[];
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const isLoadingSession = status === "loading";

  // Fetch user's registered events
  const {
    data: response,
    error,
    isLoading,
  } = useApi<Response>(session ? "/api/dashboard" : null, session?.accessToken);

  const events = response?.registeredEvents;

  if (isLoadingSession || isLoading) {
    return <DashboardSkeleton />;
  }
  //Doesn't happen if Protected is working properly.
  if (!session) return;

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-bold">Welcome, {session.user?.email}</h1>
          <p className="text-muted-foreground mt-2">
            Here are the events you&apos;ve registered for
          </p>
        </section>

        {/* Registered Events Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Registered Events</span>
                <Button asChild size="sm">
                  <Link href="/events">Browse Events</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  Failed to load events
                </div>
              ) : events?.length ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      footer={
                        <div className="flex justify-end w-full px-3">
                          <Button asChild size="sm">
                            <Link href={`/dashboard/feedback/${event.id}`}>
                              Feedback
                            </Link>
                          </Button>
                        </div>
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven&apos;t registered for any events yet
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/events">Find Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
export default DashboardPage;

// Loading Skeletons
const DashboardSkeleton = () => {
  return (
    <div className="container py-8 space-y-8">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-80" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
