import { NextResponse } from "next/server"
import type { Task } from "@/types"

// Mock database for tasks
const tasks: Record<string, Task[]> = {
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
  "4": [
    { id: "4-1", title: "Build portfolio website", completed: false, priority: "medium" },
    { id: "4-2", title: "Learn React Native", completed: false, priority: "low" },
  ],
}

export async function GET(request: Request, { params }: { params: { nodeId: string } }) {
  try {
    const nodeId = params.nodeId
    const nodeTasks = tasks[nodeId] || []

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 50))

    return NextResponse.json({ tasks: nodeTasks })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { nodeId: string } }) {
  try {
    const nodeId = params.nodeId
    const newTask: Omit<Task, "id"> = await request.json()

    const task: Task = {
      ...newTask,
      id: `${nodeId}-${Date.now()}`,
    }

    if (!tasks[nodeId]) {
      tasks[nodeId] = []
    }

    tasks[nodeId].push(task)

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
