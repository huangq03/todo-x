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
    // Only handle left mouse button (button 0)
    if (e.button !== 0) return

    e.stopPropagation()
    setIsDragging(true)

    // Calculate offset from the node's center position (accounting for the transform)
    const container = nodeRef.current?.parentElement
    if (container) {
      const containerRect = container.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - containerRect.left - node.x,
        y: e.clientY - containerRect.top - node.y,
      })
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDragging) {
      onClick()
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
      className={`group absolute cursor-pointer transition-all duration-200 ${isSelected ? "scale-105 z-20" : "z-10"} ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: node.x,
        top: node.y,
        transform: "translate(-50%, -50%)",
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {/* Node */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-md border transition-all duration-200 min-w-[100px] max-w-[160px] ${
          isSelected
            ? "border-gray-300 dark:border-gray-600 shadow-sm"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        }`}
      >
        {/* Header */}
        <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-t-md border-b border-gray-100 dark:border-gray-600">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm opacity-70">{node.icon}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{node.title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2">
          {taskCount > 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              {completedTasks}/{taskCount} tasks
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Click to view details</div>
            </div>
          )}
          {taskCount === 0 && (
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
              <div className="text-xs text-gray-400 dark:text-gray-500">Click to add tasks</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              onAddChild()
            }}
          >
            <Plus className="h-2.5 w-2.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-2.5 w-2.5" />
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
