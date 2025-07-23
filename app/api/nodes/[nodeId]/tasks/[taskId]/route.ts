import { NextResponse } from "next/server"
import type { Task } from "@/types"

// Mock database for tasks (same as above)
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

export async function PUT(request: Request, { params }: { params: { nodeId: string; taskId: string } }) {
  try {
    const { nodeId, taskId } = params
    const updates: Partial<Task> = await request.json()

    if (!tasks[nodeId]) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    const taskIndex = tasks[nodeId].findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[nodeId][taskIndex] = { ...tasks[nodeId][taskIndex], ...updates }

    return NextResponse.json({ task: tasks[nodeId][taskIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { nodeId: string; taskId: string } }) {
  try {
    const { nodeId, taskId } = params

    if (!tasks[nodeId]) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    const taskIndex = tasks[nodeId].findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasks[nodeId].splice(taskIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
