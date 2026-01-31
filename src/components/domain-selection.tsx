"use client";

import { useState } from "react";
import { updateUserDomain } from "@/app/actions/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const domains = [
  {
    id: "software-engineering",
    name: "Software Engineering",
    icon: "💻",
    description: "Master algorithms, system design, and software architecture",
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: "📊",
    description: "Learn data analysis, machine learning, and statistics",
  },
  {
    id: "product-design",
    name: "Product Design",
    icon: "🎨",
    description: "Create beautiful UX/UI and product experiences",
  },
];

interface DomainSelectionProps {
  currentDomain?: string | null;
}

export function DomainSelection({ currentDomain }: DomainSelectionProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDomainSelect = async (domainId: string) => {
    try {
      setLoading(domainId);
      setError(null);
      await updateUserDomain(domainId);
      // Success - page will revalidate automatically
    } catch (err) {
      setError("Failed to update domain. Please try again.");
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  // If user already has a domain, show their current path
  if (currentDomain) {
    const selectedDomain = domains.find((d) => d.id === currentDomain);
    return (
      <div className="text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 p-12 shadow-lg">
          <div className="mb-4 text-6xl">{selectedDomain?.icon || "🎯"}</div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Current Path
          </h2>
          <p className="text-2xl font-semibold text-blue-600">
            {selectedDomain?.name || currentDomain}
          </p>
          <p className="mt-4 text-gray-600">
            {selectedDomain?.description || "Your personalized learning journey"}
          </p>
        </div>
      </div>
    );
  }

  // Show domain selection cards
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Select Your Domain
        </h2>
        <p className="mt-2 text-gray-600">
          Choose a path to start your personalized learning journey
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className="transition-all hover:shadow-lg hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mb-4 text-5xl">{domain.icon}</div>
              <CardTitle className="text-xl">{domain.name}</CardTitle>
              <CardDescription className="mt-2">
                {domain.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleDomainSelect(domain.id)}
                disabled={loading !== null}
                className="w-full"
                size="lg"
              >
                {loading === domain.id ? "Saving..." : "Select This Path"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
