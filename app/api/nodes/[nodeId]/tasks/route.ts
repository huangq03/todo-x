import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Task } from "@/types"

export async function GET(request: Request, { params }: { params: { nodeId: string } }) {
  try {
    const nodeId = params.nodeId

    // Fetch tasks from Supabase
    const { data: tasksData, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("node_id", nodeId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
    }

    // Transform database format to application format
    const tasks: Task[] = tasksData.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.due_date || undefined,
      notes: task.notes || undefined,
    }))

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { nodeId: string } }) {
  try {
    const nodeId = params.nodeId
    const newTask: Omit<Task, "id"> = await request.json()

    // Insert new task into Supabase
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        node_id: nodeId,
        title: newTask.title,
        completed: newTask.completed || false,
        priority: newTask.priority || "medium",
        due_date: newTask.dueDate || null,
        notes: newTask.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
    }

    // Transform back to application format
    const createdTask: Task = {
      id: data.id,
      title: data.title,
      completed: data.completed,
      priority: data.priority,
      dueDate: data.due_date || undefined,
      notes: data.notes || undefined,
    }

    return NextResponse.json({ task: createdTask }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
