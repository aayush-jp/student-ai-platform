"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Section */}
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            Master Your Career
            <span className="block text-blue-600">with AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            Personalized learning paths powered by your behavior
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
            </SignUpButton>
          </div>

          {/* Optional: Feature highlights */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">🎯</div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Personalized Learning
                </h3>
                <p className="text-sm text-gray-600">
                  AI adapts to your unique learning style and pace
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">📊</div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Track Progress
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor your growth with detailed analytics
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">🚀</div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Career Ready
                </h3>
                <p className="text-sm text-gray-600">
                  Build skills that matter in today's job market
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
