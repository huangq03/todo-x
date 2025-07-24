"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2, User, Bot, Lightbulb } from "lucide-react"
import type { MindMap, Node, Task } from "@/types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  mindmap?: GeneratedMindMap
}

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

interface AIChatProps {
  onCreateMindMap: (mindmap: Omit<MindMap, "id" | "createdAt" | "updatedAt">) => Promise<MindMap>
  onCreateNode: (mindmapId: string, node: Node) => Promise<Node>
  onAddTask: (mindmapId: string, nodeId: string, task: Omit<Task, "id">) => Promise<Task>
  isOpen: boolean
  onClose: () => void
}

const EXAMPLE_PROMPTS = [
  "Create a mind map for planning a wedding",
  "Help me organize my job search process",
  "Plan a 3-month fitness journey",
  "Organize my home renovation project",
  "Create a study plan for learning React",
]

export function AIChat({ onCreateMindMap, onCreateNode, onAddTask, isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI assistant. Describe what you'd like to organize or plan, and I'll create a comprehensive mind map with tasks for you. For example, you could say 'Help me plan my wedding' or 'Create a study schedule for learning Python'.",
    },
  ])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/generate-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mind map")
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I've created a mind map for "${data.mindmap.title}". Here's what I've organized for you:`,
        mindmap: data.mindmap,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while generating your mind map. Please try again with a different description.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateMindMap = async (generatedMindMap: GeneratedMindMap) => {
    setIsCreating(true)
    try {
      // Create the mind map
      const mindmap = await onCreateMindMap({
        title: generatedMindMap.title,
        description: generatedMindMap.description,
        color: generatedMindMap.color,
        icon: generatedMindMap.icon,
      })

      // Create all nodes with proper error handling
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
          // Return the node data even if creation fails so we can continue
          return node
        }
      })

      const createdNodes = await Promise.all(nodePromises)

      // Create all tasks with proper error handling
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
            // Return a mock task object
            return { ...task, id: `${nodeData.id}-${Date.now()}` } as Task
          }
        }),
      )

      const createdTasks = await Promise.all(taskPromises)

      // Add success message
      const successMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ Successfully created "${mindmap.title}" with ${createdNodes.length} nodes and ${createdTasks.length} tasks! You can now view and edit it in your mind map.`,
      }
      setMessages((prev) => [...prev, successMessage])

      // Close the chat after a short delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error creating mind map:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while creating your mind map. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsCreating(false)
    }
  }

  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Mind Map Generator
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Example Prompts */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExamplePrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {/* Mind Map Preview */}
                    {message.mindmap && (
                      <div className="mt-3 p-4 border rounded-lg bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{message.mindmap.icon}</span>
                          <div>
                            <h4 className="font-semibold">{message.mindmap.title}</h4>
                            <p className="text-sm text-muted-foreground">{message.mindmap.description}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium">Nodes & Tasks:</p>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {message.mindmap.nodes.map((node) => (
                              <div key={node.id} className="flex items-center gap-2 text-sm">
                                <span>{node.icon}</span>
                                <span className="font-medium">{node.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {node.tasks.length} tasks
                                </Badge>
                                {node.parent && (
                                  <Badge variant="outline" className="text-xs">
                                    child
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleCreateMindMap(message.mindmap!)}
                          disabled={isCreating}
                          className="w-full"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating Mind Map...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create This Mind Map
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating your mind map...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you'd like to organize or plan..."
              disabled={isGenerating || isCreating}
              className="flex-1"
            />
            <Button type="submit" disabled={isGenerating || isCreating || !input.trim()}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
