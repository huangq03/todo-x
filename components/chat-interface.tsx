"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Lightbulb, Target, Calendar, Users } from "lucide-react"
import type { MindMap, Node, Task } from "@/types"

interface ChatInterfaceProps {
  onCreateMindMap: (mindmapData: Omit<MindMap, "id" | "createdAt" | "updatedAt">) => Promise<MindMap>
  onCreateNode: (mindmapId: string, node: Node) => Promise<Node>
  onAddTask: (nodeId: string, task: Omit<Task, "id">) => Promise<Task>
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export function ChatInterface({
  onCreateMindMap,
  onCreateNode,
  onAddTask,
  isGenerating,
  setIsGenerating,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      // Generate mind map via AI API
      const response = await fetch("/api/ai/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input.trim() }),
      })

      if (!response.ok) throw new Error("Failed to generate mind map")

      const { mindmap, nodes } = await response.json()

      // Create the mind map
      const createdMindMap = await onCreateMindMap(mindmap)

      // Create all nodes
      for (const node of nodes) {
        const createdNode = await onCreateNode(createdMindMap.id, node)

        // Add tasks to the node if any
        if (node.tasks && node.tasks.length > 0) {
          for (const task of node.tasks) {
            await onAddTask(createdNode.id, task)
          }
        }
      }

      setInput("")
    } catch (error) {
      console.error("Failed to generate mind map:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  const examples = [
    {
      icon: <Target className="h-4 w-4" />,
      title: "Project Planning",
      description: "Plan a mobile app development project",
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      title: "Learning Path",
      description: "Create a learning roadmap for React development",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      title: "Event Organization",
      description: "Organize a team building event",
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Team Structure",
      description: "Design an organizational chart for a startup",
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">What would you like to create?</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Describe your project, goal, or idea and I'll create an interactive mind map with tasks.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Plan a marketing campaign for a new product launch..."
              className="flex-1"
              disabled={isGenerating}
            />
            <Button type="submit" disabled={!input.trim() || isGenerating}>
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
              onClick={() => handleExampleClick(example.description)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-gray-500 dark:text-gray-400 mt-0.5">{example.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{example.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{example.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
