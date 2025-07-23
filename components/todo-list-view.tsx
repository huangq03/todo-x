"use client"

import type React from "react"

import { useState } from "react"
import type { Node, Task } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Flag, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TodoListViewProps {
  node: Node
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onAddTask: (nodeId: string, task: Omit<Task, "id">) => void
  onUpdateTask: (nodeId: string, taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (nodeId: string, taskId: string) => void
  focusMode?: boolean
}

export function TodoListView({
  node,
  onUpdateNode,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  focusMode = false,
}: TodoListViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")

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
    <div
      className={`h-full ${focusMode ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950" : "bg-background"}`}
    >
      <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: node.color }}
            >
              {node.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{node.title}</h1>
              <p className="text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed ({completionPercentage}%)
              </p>
            </div>
          </div>

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
        </div>

        {/* Add Task */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
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
        <div className="flex-1 overflow-auto">
          {node.tasks && node.tasks.length > 0 ? (
            <div className="space-y-2">
              {node.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 ${
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p>Add your first task to get started!</p>
            </div>
          )}
        </div>

        {/* Focus Mode Timer */}
        {focusMode && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="text-3xl font-mono mb-2">25:00</div>
              <div className="flex gap-2 justify-center">
                <Button size="sm">Start Pomodoro</Button>
                <Button size="sm" variant="outline">
                  Take Break
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
