"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useParams, useRouter } from "next/navigation";

import { Button } from "src/components/ui/button";
import { Skeleton } from "src/components/ui/skeleton";
import { useApi } from "src/hooks/useApi";
import { registerEventService } from "src/lib/services/events/registerEvent";
import { useEffect } from "react";
import type { IEvent } from "src/types/event-type";

export default function EventDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();

  //get event
  const { data, error, isLoading } = useApi<{ data: IEvent }>(
    `/api/events/${params.id}`
  );
  const event = data?.data;
  //event is finished
  const isFinished =
    event && parseISO(event.dateTime).getTime() < new Date().getTime();

  const handleRegister = async () => {
    if (!event || !session?.accessToken || typeof params?.id !== "string")
      return;

    registerEventService(params.id, session.accessToken).then((result) => {
      if (result.isSuccess) {
        toast.success("register successfully");
        router.push("/dashboard");
      } else if (result.error === "DuplicateRegistration") {
        //If the user was previously registered
        toast.error("You have already registered for this event");
      } else {
        //Unknown error
        toast.error("register failed");
      }
    });
  };

  useEffect(() => {
    if (error) toast.error("Failed to load event");
  }, [error]);

  return (
    <div className="container py-8">
      {isLoading || !event ? (
        <EventDetailSkeleton />
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{event?.title}</h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {event && format(parseISO(event.dateTime), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {event && format(parseISO(event.dateTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event?.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <p className="whitespace-pre-line">{event?.description}</p>
            </div>

            <div>
              <Button
                onClick={handleRegister}
                disabled={isLoading || isFinished}
                variant={"default"}
              >
                {"Register"}
              </Button>
              {isFinished && (
                <p className="text-red-500 text-sm mt-1">Event is finished !</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EventDetailSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Skeleton className="h-9 w-3/4 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="flex justify-between items-center p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};
