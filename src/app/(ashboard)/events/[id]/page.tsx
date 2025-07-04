"use client";

import { useApi } from "src/hooks/useApi";
import { Button } from "src/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Skeleton } from "src/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { SERVER_BASE_URL } from "src/lib/services/services-config";
import { useParams, useRouter } from "next/navigation";
import { registerEventService } from "src/lib/services/events/registerEvent";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  dateTime: string;
}

export default function EventDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();

  const { data, error, isLoading } = useApi<{ data: Event }>(
    SERVER_BASE_URL + `/api/events/${params.id}`
  );
  const event = data?.data;
  const eventFinished =
    event && parseISO(event.dateTime).getTime() < new Date().getTime();

  const handleRegister = async () => {
    if (event && session?.accessToken) {
      registerEventService(+params.id!, session.accessToken).then((result) => {
        if (result.isSuccess) {
          toast.success("register successfully");
          router.push("/dashboard");
        } else if (result.error === "DuplicateRegistration") {
          toast.error("You have already registered for this event");
        } else {
          toast.error("register failed");
        }
      });
    }
  };

  if (error) return <div className="container py-8">Failed to load event</div>;

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
                disabled={isLoading || eventFinished}
                variant={"default"}
              >
                {"Register"}
              </Button>
              {eventFinished && (
                <p className="text-red-500 text-sm mt-1">Event is finished !</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventDetailSkeleton() {
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
}
