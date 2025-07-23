import { NextResponse } from "next/server"
import type { Task } from "@/types"

// Same mock database as above
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

export async function PUT(
  request: Request,
  { params }: { params: { mindmapId: string; nodeId: string; taskId: string } },
) {
  try {
    const { mindmapId, nodeId, taskId } = await params
    const updates: Partial<Task> = await request.json()

    if (!tasksByMindmapAndNode[mindmapId]?.[nodeId]) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    const taskIndex = tasksByMindmapAndNode[mindmapId][nodeId].findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasksByMindmapAndNode[mindmapId][nodeId][taskIndex] = {
      ...tasksByMindmapAndNode[mindmapId][nodeId][taskIndex],
      ...updates,
    }

    return NextResponse.json({ task: tasksByMindmapAndNode[mindmapId][nodeId][taskIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { mindmapId: string; nodeId: string; taskId: string } },
) {
  try {
    const { mindmapId, nodeId, taskId } = await params

    if (!tasksByMindmapAndNode[mindmapId]?.[nodeId]) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    const taskIndex = tasksByMindmapAndNode[mindmapId][nodeId].findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    tasksByMindmapAndNode[mindmapId][nodeId].splice(taskIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
