"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import { toast } from "sonner";
import { Star, ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "src/components/ui/card";
import { feedbackService } from "src/lib/services/feedback/feedbackService";

export default function FeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || typeof id !== "string" || !rating || !comment) return;

    setIsSubmitting(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = (session as any)?.accessToken;
    feedbackService(id, rating, comment, accessToken).then((result) => {
      if (result.isSuccess) {
        toast.success("Feedback submitted successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error);
      }
      setIsSubmitting(false);
    });
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Event Feedback</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share your experience with this event
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                How would you rate this event?
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none cursor-pointer"
                  >
                    {rating && star <= rating ? (
                      <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="h-8 w-8 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium mb-2"
              >
                Additional comments
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this event?"
                className="min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              disabled={!rating || !comment || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
