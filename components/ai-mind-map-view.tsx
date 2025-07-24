"use client"

import type React from "react"

import { useRef, useState } from "react"
import type { Node } from "@/types"
import { NodeComponent } from "./node-component"
import { ConnectionLines } from "./connection-lines"
import { Button } from "@/components/ui/button"
import { Plus, ZoomIn, ZoomOut, RotateCcw, Sparkles, Wand2, Target } from "lucide-react"

interface AIMindMapViewProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onAddNode: (parentId?: string) => void
  onOpenAIChat: () => void
}

export function AIMindMapView({
  nodes,
  selectedNode,
  onSelectNode,
  onUpdateNode,
  onAddNode,
  onOpenAIChat,
}: AIMindMapViewProps) {
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

  const getOverallProgress = () => {
    if (nodes.length === 0) return 0
    const totalTasks = nodes.reduce((acc, node) => acc + (node.tasks?.length || 0), 0)
    const completedTasks = nodes.reduce(
      (acc, node) => acc + (node.tasks?.filter((task) => task.completed).length || 0),
      0,
    )
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* AI-Enhanced Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAddNode()}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenAIChat}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Enhancement Button */}
        {selectedNode && (
          <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900 dark:hover:to-cyan-900 shadow-lg"
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Enhance
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      {nodes.length > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-blue-600">{getOverallProgress()}%</span>
            </div>
          </div>
        </div>
      )}

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

      {/* AI-Powered Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative text-8xl">🧠</div>
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Let AI Create Your Mind Map
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Describe what you want to organize, and our AI will create a comprehensive mind map with tasks,
              priorities, and smart organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={onOpenAIChat}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
              <Button variant="outline" onClick={() => onAddNode()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Manually
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
