import { NextResponse } from "next/server"
import type { Node } from "@/types"

// Mock database - in a real app, this would be your database
const nodes: Node[] = [
  {
    id: "1",
    title: "University Applications",
    x: 400,
    y: 200,
    color: "#3B82F6",
    icon: "🎓",
    children: ["2", "3"],
  },
  {
    id: "2",
    title: "Personal Statement",
    x: 200,
    y: 350,
    color: "#10B981",
    icon: "📝",
    parent: "1",
  },
  {
    id: "3",
    title: "College Research",
    x: 600,
    y: 350,
    color: "#F59E0B",
    icon: "🔍",
    parent: "1",
  },
  {
    id: "4",
    title: "Side Projects",
    x: 400,
    y: 500,
    color: "#8B5CF6",
    icon: "💡",
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({ nodes })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newNode: Node = await request.json()

    // Add the new node
    nodes.push(newNode)

    // If it has a parent, update the parent's children array
    if (newNode.parent) {
      const parentNode = nodes.find((n) => n.id === newNode.parent)
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

export async function PUT(request: Request) {
  try {
    const { id, updates }: { id: string; updates: Partial<Node> } = await request.json()

    const nodeIndex = nodes.findIndex((n) => n.id === id)
    if (nodeIndex === -1) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 })
    }

    nodes[nodeIndex] = { ...nodes[nodeIndex], ...updates }

    return NextResponse.json({ node: nodes[nodeIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 })
  }
}
