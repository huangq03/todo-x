"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { Node } from "@/types"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NodeComponentProps {
  node: Node
  isSelected: boolean
  completionPercentage: number
  onClick: () => void
  onUpdatePosition: (x: number, y: number) => void
  onAddChild: () => void
}

export function NodeComponent({
  node,
  isSelected,
  completionPercentage,
  onClick,
  onUpdatePosition,
  onAddChild,
}: NodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Use useEffect to properly handle global mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && nodeRef.current) {
        const container = nodeRef.current.parentElement
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const newX = e.clientX - containerRect.left - dragOffset.x
          const newY = e.clientY - containerRect.top - dragOffset.y
          onUpdatePosition(newX, newY)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, onUpdatePosition])

  const taskCount = node.tasks?.length || 0
  const completedTasks = node.tasks?.filter((task) => task.completed).length || 0

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-pointer transition-all duration-200 ${isSelected ? "scale-110 z-20" : "z-10"} ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: node.x,
        top: node.y,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      {/* Progress Ring */}
      {taskCount > 0 && (
        <div className="absolute -inset-2">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={node.color}
              strokeWidth="3"
              strokeDasharray={`${completionPercentage * 2.83} 283`}
              strokeLinecap="round"
              className="transition-all duration-500"
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      )}

      {/* Node */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 min-w-[120px] max-w-[200px] ${
          isSelected ? "border-blue-500 shadow-xl" : "border-gray-200 dark:border-gray-700 hover:shadow-xl"
        }`}
        style={{ borderColor: isSelected ? node.color : undefined }}
      >
        {/* Header */}
        <div className="p-3 rounded-t-xl text-white font-medium text-center" style={{ backgroundColor: node.color }}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{node.icon}</span>
            <span className="text-sm truncate">{node.title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {taskCount > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              {completedTasks}/{taskCount} tasks completed
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation()
              onAddChild()
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 bg-white shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit Node</DropdownMenuItem>
              <DropdownMenuItem>Change Color</DropdownMenuItem>
              <DropdownMenuItem>Delete Node</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
