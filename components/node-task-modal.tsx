"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, Flag, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Node, Task } from "@/types"

interface NodeTaskModalProps {
  node: Node | null
  isOpen: boolean
  onClose: () => void
  onAddTask: (nodeId: string, task: Omit<Task, "id">) => void
  onUpdateTask: (nodeId: string, taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (nodeId: string, taskId: string) => void
}

export function NodeTaskModal({ node, isOpen, onClose, onAddTask, onUpdateTask, onDeleteTask }: NodeTaskModalProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")

  if (!node) return null

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(node.id, {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const completedTasks = node.tasks?.filter((task) => task.completed).length || 0
  const totalTasks = node.tasks?.length || 0
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-lg">{node.icon}</span>
            <div>
              <h2 className="text-lg font-medium">{node.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
                backgroundColor: node.color,
              }}
            />
          </div>

          {/* Add Task */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Select
                value={newTaskPriority}
                onValueChange={(value: "low" | "medium" | "high") => setNewTaskPriority(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {node.tasks && node.tasks.length > 0 ? (
              node.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => onUpdateTask(node.id, task.id, { completed: !!checked })}
                    />

                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {task.dueDate}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority || "medium")}>
                        <Flag className="h-3 w-3 mr-1" />
                        {task.priority}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => onDeleteTask(node.id, task.id)}>
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p>Add your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
