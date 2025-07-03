"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import useSWR from "swr";
import { Skeleton } from "src/components/ui/skeleton";
import Link from "next/link";
import { EventCard, EventCardSkeleton } from "src/components/events/event-card";
import { SERVER_BASE_URL } from "src/lib/services/services-config";
import axios from "axios";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  dateTime: string; // ISO format
}

interface Response {
  registeredEvents: Event[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const isLoadingSession = status === "loading";

  // Fetch user's registered events
  const {
    data: response,
    error,
    isLoading,
  } = useSWR<Response>(
    session ? SERVER_BASE_URL + "/api/dashboard" : null,
    (url: string) =>
      axios
        .get(url, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          headers: { Authorization: `Bearer ${(session as any).accessToken}` },
        })
        .then((result) => result.data)
  );
  const events = response?.registeredEvents;

  console.log({ response, error, isLoading });

  if (isLoadingSession) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-bold">Welcome, {session.user?.name}</h1>
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
                    <EventCard key={event.id} event={event} />
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
}

// Loading Skeletons
function DashboardSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-80" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
