import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define the schema for the generated mind map
const MindMapSchema = z.object({
  title: z.string().describe("The main title of the mind map"),
  description: z.string().describe("A brief description of what this mind map is about"),
  color: z.string().describe("A hex color code for the mind map theme"),
  icon: z.string().describe("An emoji that represents the mind map"),
  nodes: z
    .array(
      z.object({
        id: z.string().describe("Unique identifier for the node"),
        title: z.string().describe("The title of the node"),
        x: z.number().describe("X coordinate for positioning (between 100-700)"),
        y: z.number().describe("Y coordinate for positioning (between 100-500)"),
        color: z.string().describe("Hex color code for the node"),
        icon: z.string().describe("Emoji representing the node"),
        parent: z.string().optional().describe("ID of parent node if this is a child"),
        tasks: z
          .array(
            z.object({
              title: z.string().describe("The task title"),
              priority: z.enum(["low", "medium", "high"]).describe("Task priority level"),
              completed: z.boolean().describe("Whether the task is completed"),
            }),
          )
          .describe("List of tasks for this node"),
      }),
    )
    .describe("All nodes in the mind map"),
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: MindMapSchema,
      prompt: `Create a comprehensive mind map based on this request: "${prompt}"

Guidelines:
- Create a hierarchical structure with a main root node and child nodes
- Position nodes in a visually appealing layout (x: 100-700, y: 100-500)
- Use appropriate colors and emojis for each node
- Generate 2-5 relevant tasks for each node
- Make some tasks completed (about 20-30%) to show progress
- Ensure the mind map is practical and actionable
- Use different colors for different branches/categories
- Keep node titles concise but descriptive

Example structure:
- Root node in center (x: 400, y: 200)
- Child nodes spread around it
- Grandchild nodes further out if needed`,
    })

    return NextResponse.json({ mindmap: result.object })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate mind map. Please try again." }, { status: 500 })
  }
}
