import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/db";
import { users, resources, userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Domain mapping for display names
const domainNames: Record<string, string> = {
  "software-engineering": "Software Engineering",
  "data-science": "Data Science",
  "product-design": "Product Design",
};

export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      console.error("Chat API: No userId found");
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the request body
    const { messages } = await req.json();
    console.log("Chat API: Received", messages.length, "messages");

    // Fetch user's selected domain
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const selectedDomain = user?.selectedDomain;
    const domainDisplayName = selectedDomain
      ? domainNames[selectedDomain] || selectedDomain
      : "your chosen field";

    // Fetch user's completed resources
    const completedResources = await db
      .select({
        title: resources.title,
        type: resources.type,
        difficulty: resources.difficulty,
      })
      .from(userProgress)
      .innerJoin(resources, eq(userProgress.resourceId, resources.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.isCompleted, true)
        )
      );

    // Build list of completed resource titles
    const completedList =
      completedResources.length > 0
        ? completedResources
            .map((r) => `${r.title} (${r.type})`)
            .join(", ")
        : "none yet";

    // Construct system prompt
    const systemPrompt = `You are an expert AI tutor specializing in ${domainDisplayName}. 

The user has completed the following resources: ${completedList}.

Your role is to:
- Guide the user on what to learn next based on their progress
- Provide personalized recommendations for their learning journey
- Answer questions related to ${domainDisplayName}
- Keep your answers concise, clear, and encouraging
- Suggest specific topics, concepts, or skills they should focus on
- Help them understand complex topics in simple terms

Be supportive, motivating, and focused on helping them achieve their learning goals.`;

    // Use streamText to generate the response
    console.log("Chat API: Calling Google AI...");
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages,
    });

    // Return the streaming response
    console.log("Chat API: Returning stream response");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}
