import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Node } from "@/types"

// Mock database - organized by mindmap
const nodesByMindmap: Record<string, Node[]> = {
  "mindmap-1": [
    {
      id: "1",
      title: "University Applications",
      x: 400,
      y: 200,
      color: "#3B82F6",
      icon: "🎓",
      children: ["2", "3"],
      mindmapId: "mindmap-1",
    },
    {
      id: "2",
      title: "Personal Statement",
      x: 200,
      y: 350,
      color: "#10B981",
      icon: "📝",
      parent: "1",
      mindmapId: "mindmap-1",
    },
    {
      id: "3",
      title: "College Research",
      x: 600,
      y: 350,
      color: "#F59E0B",
      icon: "🔍",
      parent: "1",
      mindmapId: "mindmap-1",
    },
  ],
  "mindmap-2": [
    {
      id: "4",
      title: "Portfolio Website",
      x: 400,
      y: 200,
      color: "#8B5CF6",
      icon: "🌐",
      children: ["5", "6"],
      mindmapId: "mindmap-2",
    },
    {
      id: "5",
      title: "Frontend Development",
      x: 250,
      y: 350,
      color: "#06B6D4",
      icon: "⚛️",
      parent: "4",
      mindmapId: "mindmap-2",
    },
    {
      id: "6",
      title: "Backend API",
      x: 550,
      y: 350,
      color: "#84CC16",
      icon: "🔧",
      parent: "4",
      mindmapId: "mindmap-2",
    },
    {
      id: "7",
      title: "Mobile App",
      x: 400,
      y: 500,
      color: "#F97316",
      icon: "📱",
      mindmapId: "mindmap-2",
    },
  ],
  "mindmap-3": [
    {
      id: "8",
      title: "Q1 Goals",
      x: 400,
      y: 200,
      color: "#10B981",
      icon: "🎯",
      children: ["9", "10"],
      mindmapId: "mindmap-3",
    },
    {
      id: "9",
      title: "Team Management",
      x: 250,
      y: 350,
      color: "#EF4444",
      icon: "👥",
      parent: "8",
      mindmapId: "mindmap-3",
    },
    {
      id: "10",
      title: "Product Launch",
      x: 550,
      y: 350,
      color: "#F59E0B",
      icon: "🚀",
      parent: "8",
      mindmapId: "mindmap-3",
    },
  ],
}

export async function GET(request: Request, { params }: { params: { mindmapId: string } }) {
  try {
    const { mindmapId } = await params

    // Fetch all nodes for this mindmap from Supabase
    const { data: nodesData, error: nodesError } = await supabase
      .from("nodes")
      .select("*")
      .eq("mindmap_id", mindmapId)
      .order("created_at", { ascending: true })

    if (nodesError) {
      console.error("Supabase error:", nodesError)
      return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
    }

    // Transform database format to application format
    const nodes: Node[] = nodesData.map((node) => ({
      id: node.id,
      title: node.title,
      x: node.x,
      y: node.y,
      color: node.color,
      icon: node.icon,
      parent: node.parent_id || undefined,
      notes: node.notes || undefined,
      mindmapId: node.mindmap_id,
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

export async function POST(request: Request, { params }: { params: { mindmapId: string } }) {
  try {
    const { mindmapId } = await params
    const newNode: Node = await request.json()

    // Insert new node into Supabase
    const { data, error } = await supabase
      .from("nodes")
      .insert({
        id: newNode.id,
        mindmap_id: mindmapId,
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

export async function PUT(request: Request, { params }: { params: { mindmapId: string } }) {
  try {
    const { mindmapId } = await params
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
