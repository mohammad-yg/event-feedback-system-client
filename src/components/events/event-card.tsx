import { format, parseISO } from "date-fns";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Skeleton } from "src/components/ui/skeleton";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    location: string;
    dateTime: string;
  };
  footer: ReactNode;
}

export function EventCard({ event, footer }: EventCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <Link href={`/events/${event.id}`}>
          <CardTitle className="truncate">{event.title}</CardTitle>
          <div className="text-sm text-gray-500">
            {format(parseISO(event.dateTime), "MMMM d, yyyy")}
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="truncate">{event.location}</span>
        </div>
      </CardContent>
      {footer}
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
