import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    location: string;
    dateTime: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <CardHeader>
        <CardTitle className="truncate">{event.title}</CardTitle>
        <div className="text-sm text-gray-500">
          {format(parseISO(event.dateTime), "MMMM d, yyyy")}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="truncate">{event.location}</span>
        </div>
      </CardContent>
      <Link className="hidden" href={`/events/${event.id}`} />
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}
