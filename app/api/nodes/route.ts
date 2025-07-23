import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Node } from "@/types"

export async function GET() {
  try {
    // Fetch all nodes from Supabase
    const { data: nodesData, error: nodesError } = await supabase
      .from("nodes")
      .select("*")
      .order("created_at", { ascending: true })

    if (nodesError) {
      console.error("Supabase error:", nodesError)
      return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
    }

    // Transform database format to application format
    const nodes: Node[] = nodesData.map((node: { id: any; title: any; x: any; y: any; color: any; icon: any; parent_id: any; notes: any }) => ({
      id: node.id,
      title: node.title,
      x: node.x,
      y: node.y,
      color: node.color,
      icon: node.icon,
      parent: node.parent_id || undefined,
      notes: node.notes || undefined,
    }))

    // Build children relationships
    const nodesWithChildren = nodes.map((node) => ({
      ...node,
      children: nodes.filter((child) => child.parent === node.id).map((child) => child.id),
    }))

    return NextResponse.json({ nodes: nodesWithChildren })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newNode: Node = await request.json()

    // Insert new node into Supabase
    const { data, error } = await supabase
      .from("nodes")
      .insert({
        id: newNode.id,
        title: newNode.title,
        x: newNode.x,
        y: newNode.y,
        color: newNode.color,
        icon: newNode.icon,
        parent_id: newNode.parent || null,
        notes: newNode.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create node" }, { status: 500 })
    }

    // Transform back to application format
    const createdNode: Node = {
      id: data.id,
      title: data.title,
      x: data.x,
      y: data.y,
      color: data.color,
      icon: data.icon,
      parent: data.parent_id || undefined,
      notes: data.notes || undefined,
      mindmapId: data.mindmap_id,
    }

    return NextResponse.json({ node: createdNode }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to create node" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates }: { id: string; updates: Partial<Node> } = await request.json()

    // Transform application format to database format
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.x !== undefined) dbUpdates.x = updates.x
    if (updates.y !== undefined) dbUpdates.y = updates.y
    if (updates.color !== undefined) dbUpdates.color = updates.color
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon
    if (updates.parent !== undefined) dbUpdates.parent_id = updates.parent
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes

    const { data, error } = await supabase.from("nodes").update(dbUpdates).eq("id", id).select().single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to update node" }, { status: 500 })
    }

    // Transform back to application format
    const updatedNode: Node = {
      id: data.id,
      title: data.title,
      x: data.x,
      y: data.y,
      color: data.color,
      icon: data.icon,
      parent: data.parent_id || undefined,
      notes: data.notes || undefined,
      mindmapId: data.mindmap_id,
    }

    return NextResponse.json({ node: updatedNode })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 })
  }
}
