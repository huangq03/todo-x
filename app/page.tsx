"use client"

import { useState } from "react"
import { MindMapView } from "@/components/mind-map-view"
import { TodoListView } from "@/components/todo-list-view"
import { SplitView } from "@/components/split-view"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "next-themes"
import type { Node, Task } from "@/types"

const initialNodes: Node[] = [
  {
    id: "1",
    title: "University Applications",
    x: 400,
    y: 200,
    color: "#3B82F6",
    icon: "🎓",
    tasks: [
      { id: "1-1", title: "Research colleges", completed: true, priority: "high" },
      { id: "1-2", title: "Write personal statement", completed: false, priority: "high" },
      { id: "1-3", title: "Get recommendation letters", completed: false, priority: "medium" },
      { id: "1-4", title: "Submit applications", completed: false, priority: "high" },
    ],
    children: ["2", "3"],
  },
  {
    id: "2",
    title: "Personal Statement",
    x: 200,
    y: 350,
    color: "#10B981",
    icon: "📝",
    tasks: [
      { id: "2-1", title: "Brainstorm topics", completed: true, priority: "medium" },
      { id: "2-2", title: "Write first draft", completed: false, priority: "high" },
      { id: "2-3", title: "Get feedback", completed: false, priority: "medium" },
      { id: "2-4", title: "Final revision", completed: false, priority: "high" },
    ],
    parent: "1",
  },
  {
    id: "3",
    title: "College Research",
    x: 600,
    y: 350,
    color: "#F59E0B",
    icon: "🔍",
    tasks: [
      { id: "3-1", title: "Create comparison spreadsheet", completed: true, priority: "medium" },
      { id: "3-2", title: "Visit campus websites", completed: false, priority: "low" },
      { id: "3-3", title: "Schedule virtual tours", completed: false, priority: "medium" },
    ],
    parent: "1",
  },
  {
    id: "4",
    title: "Side Projects",
    x: 400,
    y: 500,
    color: "#8B5CF6",
    icon: "💡",
    tasks: [
      { id: "4-1", title: "Build portfolio website", completed: false, priority: "medium" },
      { id: "4-2", title: "Learn React Native", completed: false, priority: "low" },
    ],
  },
]

export default function Home() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewMode, setViewMode] = useState<"mindmap" | "todo" | "split">("mindmap")
  const [focusMode, setFocusMode] = useState(false)

  const updateNode = (nodeId: string, updates: Partial<Node>) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)))
  }

  const addTask = (nodeId: string, task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `${nodeId}-${Date.now()}`,
    }

    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, tasks: [...(node.tasks || []), newTask] } : node)),
    )
  }

  const updateTask = (nodeId: string, taskId: string, updates: Partial<Task>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              tasks: node.tasks?.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
            }
          : node,
      ),
    )
  }

  const deleteTask = (nodeId: string, taskId: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              tasks: node.tasks?.filter((task) => task.id !== taskId),
            }
          : node,
      ),
    )
  }

  const addNode = (parentId?: string) => {
    const newNode: Node = {
      id: Date.now().toString(),
      title: "New Node",
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      color: "#6B7280",
      icon: "📋",
      tasks: [],
      parent: parentId,
    }

    setNodes((prev) => {
      const updated = [...prev, newNode]
      if (parentId) {
        return updated.map((node) =>
          node.id === parentId ? { ...node, children: [...(node.children || []), newNode.id] } : node,
        )
      }
      return updated
    })
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background">
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          selectedNode={selectedNode}
        />

        <div className="flex-1 flex">
          <Sidebar nodes={nodes} selectedNode={selectedNode} onSelectNode={setSelectedNode} onAddNode={addNode} />

          <main className="flex-1">
            {viewMode === "mindmap" && (
              <MindMapView
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                onUpdateNode={updateNode}
                onAddNode={addNode}
              />
            )}

            {viewMode === "todo" && selectedNode && (
              <TodoListView
                node={selectedNode}
                onUpdateNode={updateNode}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                focusMode={focusMode}
              />
            )}

            {viewMode === "split" && (
              <SplitView
                nodes={nodes}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                onUpdateNode={updateNode}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddNode={addNode}
              />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
