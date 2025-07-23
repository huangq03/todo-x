import { NextResponse } from "next/server"
import type { Task } from "@/types"

// Mock database for tasks - organized by mindmap and node
const tasksByMindmapAndNode: Record<string, Record<string, Task[]>> = {
  "mindmap-1": {
    "1": [
      { id: "1-1", title: "Research colleges", completed: true, priority: "high" },
      { id: "1-2", title: "Write personal statement", completed: false, priority: "high" },
      { id: "1-3", title: "Get recommendation letters", completed: false, priority: "medium" },
      { id: "1-4", title: "Submit applications", completed: false, priority: "high" },
    ],
    "2": [
      { id: "2-1", title: "Brainstorm topics", completed: true, priority: "medium" },
      { id: "2-2", title: "Write first draft", completed: false, priority: "high" },
      { id: "2-3", title: "Get feedback", completed: false, priority: "medium" },
      { id: "2-4", title: "Final revision", completed: false, priority: "high" },
    ],
    "3": [
      { id: "3-1", title: "Create comparison spreadsheet", completed: true, priority: "medium" },
      { id: "3-2", title: "Visit campus websites", completed: false, priority: "low" },
      { id: "3-3", title: "Schedule virtual tours", completed: false, priority: "medium" },
    ],
  },
  "mindmap-2": {
    "4": [
      { id: "4-1", title: "Choose tech stack", completed: true, priority: "high" },
      { id: "4-2", title: "Design wireframes", completed: false, priority: "high" },
    ],
    "5": [
      { id: "5-1", title: "Set up React project", completed: true, priority: "medium" },
      { id: "5-2", title: "Implement responsive design", completed: false, priority: "medium" },
      { id: "5-3", title: "Add animations", completed: false, priority: "low" },
    ],
    "6": [
      { id: "6-1", title: "Design database schema", completed: false, priority: "high" },
      { id: "6-2", title: "Implement REST API", completed: false, priority: "high" },
    ],
    "7": [
      { id: "7-1", title: "Learn React Native", completed: false, priority: "medium" },
      { id: "7-2", title: "Build MVP", completed: false, priority: "low" },
    ],
  },
  "mindmap-3": {
    "8": [
      { id: "8-1", title: "Set quarterly objectives", completed: true, priority: "high" },
      { id: "8-2", title: "Review team performance", completed: false, priority: "medium" },
    ],
    "9": [
      { id: "9-1", title: "Schedule 1-on-1s", completed: false, priority: "high" },
      { id: "9-2", title: "Plan team building", completed: false, priority: "low" },
    ],
    "10": [
      { id: "10-1", title: "Finalize product features", completed: false, priority: "high" },
      { id: "10-2", title: "Coordinate marketing", completed: false, priority: "medium" },
    ],
  },
}

export async function GET(request: Request, { params }: { params: { mindmapId: string; nodeId: string } }) {
  try {
    const { mindmapId, nodeId } = params
    const tasks = tasksByMindmapAndNode[mindmapId]?.[nodeId] || []

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50))

    return NextResponse.json({ tasks })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { mindmapId: string; nodeId: string } }) {
  try {
    const { mindmapId, nodeId } = params
    const newTask: Omit<Task, "id"> = await request.json()

    const task: Task = {
      ...newTask,
      id: `${nodeId}-${Date.now()}`,
    }

    if (!tasksByMindmapAndNode[mindmapId]) {
      tasksByMindmapAndNode[mindmapId] = {}
    }
    if (!tasksByMindmapAndNode[mindmapId][nodeId]) {
      tasksByMindmapAndNode[mindmapId][nodeId] = []
    }

    tasksByMindmapAndNode[mindmapId][nodeId].push(task)

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
