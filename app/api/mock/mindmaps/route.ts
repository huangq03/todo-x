import { NextResponse } from "next/server"
import type { MindMap } from "@/types"

// Mock database for mind maps
const mindmaps: MindMap[] = [
  {
    id: "mindmap-1",
    title: "University Applications",
    description: "Planning and tracking my university application process",
    color: "#3B82F6",
    icon: "🎓",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "mindmap-2",
    title: "Personal Projects",
    description: "Side projects and learning goals",
    color: "#8B5CF6",
    icon: "💡",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "mindmap-3",
    title: "Work Tasks",
    description: "Professional responsibilities and deadlines",
    color: "#10B981",
    icon: "💼",
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-22T11:45:00Z",
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.json({ mindmaps })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mind maps" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newMindMap: Omit<MindMap, "id" | "createdAt" | "updatedAt"> = await request.json()

    const mindmap: MindMap = {
      ...newMindMap,
      id: `mindmap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mindmaps.push(mindmap)

    return NextResponse.json({ mindmap }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create mind map" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates }: { id: string; updates: Partial<MindMap> } = await request.json()

    const mindmapIndex = mindmaps.findIndex((m) => m.id === id)
    if (mindmapIndex === -1) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 })
    }

    mindmaps[mindmapIndex] = {
      ...mindmaps[mindmapIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ mindmap: mindmaps[mindmapIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update mind map" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json()

    const mindmapIndex = mindmaps.findIndex((m) => m.id === id)
    if (mindmapIndex === -1) {
      return NextResponse.json({ error: "Mind map not found" }, { status: 404 })
    }

    mindmaps.splice(mindmapIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete mind map" }, { status: 500 })
  }
}
