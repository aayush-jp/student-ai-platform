import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, resources, userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DomainSelection } from "@/components/domain-selection";
import { ResourceCard } from "@/components/resource-card";

// Domain mapping for display names
const domainNames: Record<string, string> = {
  "software-engineering": "Software Engineering",
  "data-science": "Data Science",
  "product-design": "Product Design",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  // Redirect to home if not signed in
  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const userName = user?.firstName || user?.username || "there";

  // Fetch user data from database
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Fetch resources if user has selected a domain
  let userResources: typeof resources.$inferSelect[] = [];
  if (dbUser?.selectedDomain) {
    userResources = await db
      .select()
      .from(resources)
      .where(eq(resources.domain, dbUser.selectedDomain));
    console.log('Fetched resources:', userResources);
  }

  // Fetch user progress
  const progressData = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));

  // Create a map of resourceId -> isCompleted
  const progressMap = new Map(
    progressData.map((p) => [p.resourceId, p.isCompleted])
  );

  // Calculate completed count
  const completedCount = progressData.filter((p) => p.isCompleted).length;

  // Calculate completion percentage
  const totalResources = userResources.length;
  const completionPercentage = totalResources > 0 
    ? Math.round((completedCount / totalResources) * 100)
    : 0;

  // Get display name for domain
  const domainDisplayName = dbUser?.selectedDomain 
    ? domainNames[dbUser.selectedDomain] || dbUser.selectedDomain
    : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Welcome, {userName}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {dbUser?.selectedDomain
              ? "Continue your personalized learning journey"
              : "Choose your domain to start your personalized learning journey"}
          </p>
        </div>

        {/* Domain Selection Component */}
        <div className="mb-12">
          <DomainSelection currentDomain={dbUser?.selectedDomain} />
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">
              Learning Streak
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">0 days</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">
              Completed Lessons
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {completedCount}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">
              Total Progress
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Recommended Resources Section */}
        {dbUser?.selectedDomain && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended For You
              </h2>
            </div>
            
            {userResources.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <p className="text-lg text-gray-600">
                  No resources found for <span className="font-semibold">{domainDisplayName}</span> yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resourceId={resource.id}
                    title={resource.title}
                    description={resource.description}
                    url={resource.url}
                    type={resource.type}
                    difficulty={resource.difficulty}
                    isCompleted={progressMap.get(resource.id) || false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
