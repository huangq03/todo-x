"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NodeComponent } from "./node-component"
import { ConnectionLines } from "./connection-lines"
import { ZoomIn, ZoomOut, RotateCcw, MessageSquare, Plus, Clock, MoreHorizontal, X } from "lucide-react"
import type { Node, Task, MindMap } from "@/types"

interface MindMapDisplayProps {
  mindmap: MindMap
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node | null) => void
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onAddTask?: (nodeId: string, task: Omit<Task, "id">) => void
  onUpdateTask?: (nodeId: string, taskId: string, updates: Partial<Task>) => void
  onDeleteTask?: (nodeId: string, taskId: string) => void
  isGenerating: boolean
}

export function MindMapDisplay({
  mindmap,
  nodes,
  selectedNode,
  onSelectNode,
  onUpdateNode,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isGenerating,
}: MindMapDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")

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

  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedNode && onAddTask) {
      onAddTask(selectedNode.id, {
        title: newTaskTitle.trim(),
        completed: false,
        priority: newTaskPriority,
      })
      setNewTaskTitle("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
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

  const selectedNodeCompletedTasks = selectedNode?.tasks?.filter((task) => task.completed).length || 0
  const selectedNodeTotalTasks = selectedNode?.tasks?.length || 0
  const selectedNodeCompletionPercentage =
    selectedNodeTotalTasks > 0 ? Math.round((selectedNodeCompletedTasks / selectedNodeTotalTasks) * 100) : 0

  return (
    <div className="flex h-full">
      {/* Main Canvas */}
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
                  onUpdatePosition={(x, y) => onUpdateNode(node.id, { x, y })}
                  onAddChild={() => {}} // Simplified - no adding children for now
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Selected Node Details */}
      {selectedNode && (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Panel Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{selectedNode.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedNode.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedNodeCompletedTasks} of {selectedNodeTotalTasks} tasks completed (
                    {selectedNodeCompletionPercentage}%)
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onSelectNode(null)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            {selectedNodeTotalTasks > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedNodeCompletionPercentage}%`,
                    backgroundColor: selectedNode.color,
                  }}
                />
              </div>
            )}
          </div>

          {/* Add Task Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Select
                  value={newTaskPriority}
                  onValueChange={(value: "low" | "medium" | "high") => setNewTaskPriority(value)}
                >
                  <SelectTrigger className="flex-1 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTask} size="sm" disabled={!newTaskTitle.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {selectedNode.tasks && selectedNode.tasks.length > 0 ? (
                selectedNode.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border transition-all duration-200 ${
                      task.completed ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) =>
                          onUpdateTask && onUpdateTask(selectedNode.id, task.id, { completed: !!checked })
                        }
                        className="mt-0.5"
                      />

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                        >
                          {task.title}
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={task.priority || "medium"}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            onUpdateTask && onUpdateTask(selectedNode.id, task.id, { priority: value })
                          }
                        >
                          <SelectTrigger className="w-20 h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Med</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                            <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onDeleteTask && onDeleteTask(selectedNode.id, task.id)}
                            >
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-3xl mb-3">📝</div>
                  <h4 className="font-medium mb-1">No tasks yet</h4>
                  <p className="text-sm">Add your first task above</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
