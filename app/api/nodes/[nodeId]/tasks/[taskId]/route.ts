import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Task } from "@/types"

export async function PUT(request: Request, { params }: { params: { nodeId: string; taskId: string } }) {
  try {
    const { taskId } = params
    const updates: Partial<Task> = await request.json()

    // Transform application format to database format
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes

    const { data, error } = await supabase.from("tasks").update(dbUpdates).eq("id", taskId).select().single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }

    // Transform back to application format
    const updatedTask: Task = {
      id: data.id,
      title: data.title,
      completed: data.completed,
      priority: data.priority,
      dueDate: data.due_date || undefined,
      notes: data.notes || undefined,
    }

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { nodeId: string; taskId: string } }) {
  try {
    const { taskId } = params

    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
