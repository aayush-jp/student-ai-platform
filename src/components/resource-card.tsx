"use client";

import { useOptimistic, useState, startTransition } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleResourceCompletion } from "@/app/actions/user";

interface ResourceCardProps {
  resourceId: string;
  title: string;
  description: string | null;
  url: string;
  type: string;
  difficulty: string | null;
  isCompleted: boolean;
}

const typeIcons: Record<string, string> = {
  video: "🎥",
  article: "📝",
  course: "📚",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Advanced: "bg-red-100 text-red-800 border-red-200",
};

export function ResourceCard({
  resourceId,
  title,
  description,
  url,
  type,
  difficulty,
  isCompleted,
}: ResourceCardProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(isCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleCompletion = async () => {
    const newValue = !optimisticCompleted;
    
    startTransition(() => {
      setIsLoading(true);
      // Optimistic update
      setOptimisticCompleted(newValue);
    });
    
    try {
      await toggleResourceCompletion(resourceId, newValue);
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="text-3xl">{typeIcons[type] || "📄"}</span>
          {difficulty && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                difficultyColors[difficulty] || "bg-gray-100 text-gray-800"
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-3 text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto space-y-3">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Resource
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleToggleCompletion}
          disabled={isLoading}
          className={`w-full ${
            optimisticCompleted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
          size="sm"
        >
          {isLoading ? (
            "Updating..."
          ) : optimisticCompleted ? (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Completed
            </>
          ) : (
            "Mark Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
