"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users, userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function updateUserDomain(domain: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  const fullName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.username || null;

  // Upsert user record (insert or update)
  await db
    .insert(users)
    .values({
      id: userId,
      email: email || "",
      fullName: fullName,
      imageUrl: user.imageUrl,
      selectedDomain: domain,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: email || "",
        fullName: fullName,
        imageUrl: user.imageUrl,
        selectedDomain: domain,
      },
    });

  // Refresh the dashboard UI
  revalidatePath("/dashboard");

  return { success: true };
}

export async function toggleResourceCompletion(
  resourceId: string,
  isCompleted: boolean
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Upsert user progress (insert or update)
  await db
    .insert(userProgress)
    .values({
      userId: userId,
      resourceId: resourceId,
      isCompleted: isCompleted,
      lastInteractedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userProgress.userId, userProgress.resourceId],
      set: {
        isCompleted: isCompleted,
        lastInteractedAt: new Date(),
      },
    });

  // Refresh the dashboard UI
  revalidatePath("/dashboard");

  return { success: true };
}

export async function resetUserDomain() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Update user record to reset selected domain
  await db
    .update(users)
    .set({
      selectedDomain: null,
    })
    .where(eq(users.id, userId));

  // Refresh the dashboard UI
  revalidatePath("/dashboard");

  return { success: true };
}
