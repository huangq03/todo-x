"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { Node } from "@/types"
import { NodeComponent } from "./node-component"
import { ConnectionLines } from "./connection-lines"
import { Button } from "@/components/ui/button"
import { Plus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface MindMapViewProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onAddNode: (parentId?: string) => void
}

export function MindMapView({ nodes, selectedNode, onSelectNode, onUpdateNode, onAddNode }: MindMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getCompletionPercentage = (node: Node) => {
    if (!node.tasks || node.tasks.length === 0) return 0
    const completed = node.tasks.filter((task) => task.completed).length
    return Math.round((completed / node.tasks.length) * 100)
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onAddNode()} className="bg-white/80 backdrop-blur-sm">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white/80 backdrop-blur-sm">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white/80 backdrop-blur-sm">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} className="bg-white/80 backdrop-blur-sm">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Mind Map Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Connection Lines */}
          <ConnectionLines nodes={nodes} />

          {/* Nodes */}
          {nodes.map((node) => (
            <NodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              completionPercentage={getCompletionPercentage(node)}
              onClick={() => onSelectNode(node)}
              onUpdatePosition={(x, y) => onUpdateNode(node.id, { x, y })}
              onAddChild={() => onAddNode(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Start Your Mind Map</h3>
            <p className="mb-4">Click the + button to add your first node</p>
          </div>
        </div>
      )}
    </div>
  )
}
