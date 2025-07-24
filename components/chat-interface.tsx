"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Sparkles, Brain, Lightbulb, Loader2, ArrowRight, Zap } from "lucide-react"
import type { MindMap, Node, Task } from "@/types"

interface GeneratedMindMap {
  title: string
  description: string
  color: string
  icon: string
  nodes: Array<{
    id: string
    title: string
    x: number
    y: number
    color: string
    icon: string
    parent?: string
    tasks: Array<{
      title: string
      priority: "low" | "medium" | "high"
      completed: boolean
    }>
  }>
}

interface ChatInterfaceProps {
  onCreateMindMap: (mindmap: Omit<MindMap, "id" | "createdAt" | "updatedAt">) => Promise<MindMap>
  onCreateNode: (mindmapId: string, node: Node) => Promise<Node>
  onAddTask: (mindmapId: string, nodeId: string, task: Omit<Task, "id">) => Promise<Task>
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

const EXAMPLE_PROMPTS = [
  "Plan my wedding in 6 months",
  "Create a study schedule for learning React",
  "Organize my job search process",
  "Plan a 3-month fitness journey",
  "Organize my home renovation project",
  "Create a business launch plan",
]

export function ChatInterface({
  onCreateMindMap,
  onCreateNode,
  onAddTask,
  isGenerating,
  setIsGenerating,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mind map")
      }

      const data = await response.json()
      const generatedMindMap: GeneratedMindMap = data.mindmap

      // Create the mind map
      const mindmap = await onCreateMindMap({
        title: generatedMindMap.title,
        description: generatedMindMap.description,
        color: generatedMindMap.color,
        icon: generatedMindMap.icon,
      })

      // Create all nodes
      const nodePromises = generatedMindMap.nodes.map(async (nodeData) => {
        const node: Node = {
          id: nodeData.id,
          title: nodeData.title,
          x: nodeData.x,
          y: nodeData.y,
          color: nodeData.color,
          icon: nodeData.icon,
          parent: nodeData.parent,
          mindmapId: mindmap.id,
        }

        try {
          return await onCreateNode(mindmap.id, node)
        } catch (error) {
          console.error(`Failed to create node ${nodeData.title}:`, error)
          return node
        }
      })

      await Promise.all(nodePromises)

      // Create all tasks
      const taskPromises = generatedMindMap.nodes.flatMap((nodeData) =>
        nodeData.tasks.map(async (taskData) => {
          const task: Omit<Task, "id"> = {
            title: taskData.title,
            priority: taskData.priority,
            completed: taskData.completed,
          }

          try {
            return await onAddTask(mindmap.id, nodeData.id, task)
          } catch (error) {
            console.error(`Failed to create task ${taskData.title}:`, error)
            return { ...task, id: `${nodeData.id}-${Date.now()}` } as Task
          }
        }),
      )

      await Promise.all(taskPromises)
    } catch (error) {
      console.error("Error generating mind map:", error)
    } finally {
      setIsGenerating(false)
      setInput("")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(input)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 dark:from-purple-950/30 dark:via-gray-900 dark:to-pink-950/30">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative text-6xl">🧠</div>
          </div>
          <h1 className="text-3xl font-normal text-gray-900 dark:text-gray-100 mb-2">
            How can I help you organize today?
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Describe what you want to organize, plan, or learn. I'll create a mind map with tasks for you.
          </p>
        </div>

        {/* Example Prompts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Lightbulb className="h-4 w-4" />
            <span>Try these examples:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                onClick={() => handleSubmit(prompt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{prompt}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to organize or plan..."
              disabled={isGenerating}
              className="pr-12 h-14 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-600 rounded-xl shadow-sm"
            />
            <Button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Generating your mind map...</span>
            </div>
          )}
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent organization with smart suggestions</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Instant Creation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Generate complete mind maps in seconds</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Task Ready</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Complete with tasks and priorities</p>
          </div>
        </div>
      </div>
    </div>
  )
}
