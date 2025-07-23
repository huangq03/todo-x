import { NextResponse } from "next/server"
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
    const nodes = nodesByMindmap[mindmapId] || []

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({ nodes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { mindmapId: string } }) {
  try {
    const { mindmapId } = await params
    const newNode: Node = await request.json()

    if (!nodesByMindmap[mindmapId]) {
      nodesByMindmap[mindmapId] = []
    }

    // Ensure the node belongs to the correct mindmap
    newNode.mindmapId = mindmapId

    nodesByMindmap[mindmapId].push(newNode)

    // If it has a parent, update the parent's children array
    if (newNode.parent) {
      const parentNode = nodesByMindmap[mindmapId].find((n) => n.id === newNode.parent)
      if (parentNode) {
        parentNode.children = parentNode.children || []
        parentNode.children.push(newNode.id)
      }
    }

    return NextResponse.json({ node: newNode }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create node" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { mindmapId: string } }) {
  try {
    const { mindmapId } = await params
    const { id, updates }: { id: string; updates: Partial<Node> } = await request.json()

    if (!nodesByMindmap[mindmapId]) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 })
    }

    const nodeIndex = nodesByMindmap[mindmapId].findIndex((n) => n.id === id)
    if (nodeIndex === -1) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    nodesByMindmap[mindmapId][nodeIndex] = { ...nodesByMindmap[mindmapId][nodeIndex], ...updates }

    return NextResponse.json({ node: nodesByMindmap[mindmapId][nodeIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 })
  }
}
