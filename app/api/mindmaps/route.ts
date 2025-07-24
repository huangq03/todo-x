import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { MindMap } from "@/types"

export async function GET() {
  try {
    // Fetch all mindmaps from Supabase
    const { data: mindmapsData, error } = await supabase
      .from("mindmaps")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch mind maps" }, { status: 500 })
    }

    // Transform database format to application format
    const mindmaps: MindMap[] = mindmapsData.map((mindmap) => ({
      id: mindmap.id,
      title: mindmap.title,
      description: mindmap.description || undefined,
      color: mindmap.color,
      icon: mindmap.icon,
      createdAt: mindmap.created_at,
      updatedAt: mindmap.updated_at,
    }))

    return NextResponse.json({ mindmaps })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch mind maps" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newMindMap: Omit<MindMap, "id" | "createdAt" | "updatedAt"> = await request.json()

    // Insert new mindmap into Supabase
    const { data, error } = await supabase
      .from("mindmaps")
      .insert({
        title: newMindMap.title,
        description: newMindMap.description || null,
        color: newMindMap.color,
        icon: newMindMap.icon,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create mind map" }, { status: 500 })
    }

    // Transform back to application format
    const createdMindMap: MindMap = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      color: data.color,
      icon: data.icon,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ mindmap: createdMindMap }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to create mind map" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates }: { id: string; updates: Partial<MindMap> } = await request.json()

    // Transform application format to database format
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon

    const { data, error } = await supabase.from("mindmaps").update(dbUpdates).eq("id", id).select().single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to update mind map" }, { status: 500 })
    }

    // Transform back to application format
    const updatedMindMap: MindMap = {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      color: data.color,
      icon: data.icon,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ mindmap: updatedMindMap })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to update mind map" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json()

    const { error } = await supabase.from("mindmaps").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to delete mind map" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to delete mind map" }, { status: 500 })
  }
}
