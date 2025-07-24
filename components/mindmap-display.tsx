"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NodeComponent } from "./node-component"
import { ConnectionLines } from "./connection-lines"
import { ZoomIn, ZoomOut, RotateCcw, MessageSquare, CheckCircle2, Circle } from "lucide-react"
import type { Node, MindMap } from "@/types"

interface MindMapDisplayProps {
  mindmap: MindMap
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onNodeDoubleClick: (node: Node) => void
  isGenerating: boolean
}

export function MindMapDisplay({
  mindmap,
  nodes,
  selectedNode,
  onSelectNode,
  onUpdateNode,
  onNodeDoubleClick,
  isGenerating,
}: MindMapDisplayProps) {
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

  const totalTasks = nodes.reduce((acc, node) => acc + (node.tasks?.length || 0), 0)
  const completedTasks = nodes.reduce(
    (acc, node) => acc + (node.tasks?.filter((task) => task.completed).length || 0),
    0,
  )

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{mindmap.icon}</span>
              <div>
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{mindmap.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mindmap.description}</p>
              </div>
            </div>

            {isGenerating && (
              <Badge variant="secondary" className="animate-pulse text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Generating...
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {completedTasks}/{totalTasks} tasks
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{getOverallProgress()}% complete</div>
              </div>
              <div className="w-24">
                <Progress value={getOverallProgress()} className="h-2" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
                onDoubleClick={() => onNodeDoubleClick(node)}
                onUpdatePosition={(x, y) => onUpdateNode(node.id, { x, y })}
                onAddChild={() => {}} // Simplified - no adding children for now
              />
            ))}
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-base">{selectedNode.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{selectedNode.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedNode.tasks?.length || 0} tasks • Double-click to view tasks
                  </p>
                </div>
              </div>

              {selectedNode.tasks && selectedNode.tasks.length > 0 && (
                <div className="space-y-2">
                  {selectedNode.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span
                        className={task.completed ? "line-through text-gray-500" : "text-gray-700 dark:text-gray-300"}
                      >
                        {task.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                  {selectedNode.tasks.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{selectedNode.tasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
