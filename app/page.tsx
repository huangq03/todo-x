"use client"

import { useState, useMemo } from "react"
import { MindMapView } from "@/components/mind-map-view"
import { TodoListView } from "@/components/todo-list-view"
import { SplitView } from "@/components/split-view"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "next-themes"
import { useNodes, useTasks, useAllNodeTasks } from "@/hooks/use-api"
import type { Node, Task } from "@/types"

export default function Home() {
  const { nodes, loading: nodesLoading, error: nodesError, createNode, updateNode } = useNodes()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewMode, setViewMode] = useState<"mindmap" | "todo" | "split">("mindmap")
  const [focusMode, setFocusMode] = useState(false)

  // Fetch all tasks for all nodes automatically
  const {
    nodeTasks,
    loading: allTasksLoading,
    error: allTasksError,
    updateNodeTask,
    addNodeTask,
    removeNodeTask,
  } = useAllNodeTasks(nodes)

  // Fetch tasks for the selected node (for real-time updates)
  const {
    tasks: selectedNodeTasks,
    loading: selectedTasksLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(selectedNode?.id || null)

  // Create enriched nodes with their tasks
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      tasks: nodeTasks[node.id] || [],
    }))
  }, [nodes, nodeTasks])

  // Update selected node with its tasks
  const enrichedSelectedNode = useMemo(() => {
    if (!selectedNode) return null
    return {
      ...selectedNode,
      tasks: selectedNodeTasks || nodeTasks[selectedNode.id] || [],
    }
  }, [selectedNode, selectedNodeTasks, nodeTasks])

  const handleUpdateNode = async (nodeId: string, updates: Partial<Node>) => {
    try {
      await updateNode(nodeId, updates)
      // Update selected node if it's the one being updated
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } catch (error) {
      console.error("Failed to update node:", error)
    }
  }

  const handleAddTask = async (nodeId: string, task: Omit<Task, "id">) => {
    try {
      const newTask = await createTask(nodeId, task)
      // Update the all tasks cache
      addNodeTask(nodeId, newTask)
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const handleUpdateTask = async (nodeId: string, taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(nodeId, taskId, updates)
      // Update the all tasks cache
      updateNodeTask(nodeId, taskId, updates)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (nodeId: string, taskId: string) => {
    try {
      await deleteTask(nodeId, taskId)
      // Update the all tasks cache
      removeNodeTask(nodeId, taskId)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleAddNode = async (parentId?: string) => {
    const newNode: Node = {
      id: Date.now().toString(),
      title: "New Node",
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      color: "#6B7280",
      icon: "📋",
      parent: parentId,
    }

    try {
      await createNode(newNode)
    } catch (error) {
      console.error("Failed to add node:", error)
    }
  }

  const isLoading = nodesLoading || allTasksLoading
  const hasError = nodesError || allTasksError

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your mind map...</p>
            {allTasksLoading && <p className="text-sm text-muted-foreground mt-2">Fetching tasks...</p>}
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (hasError) {
    return (
      <ThemeProvider>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground">{nodesError || allTasksError}</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background">
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          selectedNode={enrichedSelectedNode}
        />

        <div className="flex-1 flex">
          <Sidebar
            nodes={enrichedNodes}
            selectedNode={enrichedSelectedNode}
            onSelectNode={setSelectedNode}
            onAddNode={handleAddNode}
          />

          <main className="flex-1">
            {viewMode === "mindmap" && (
              <MindMapView
                nodes={enrichedNodes}
                selectedNode={enrichedSelectedNode}
                onSelectNode={setSelectedNode}
                onUpdateNode={handleUpdateNode}
                onAddNode={handleAddNode}
              />
            )}

            {viewMode === "todo" && enrichedSelectedNode && (
              <TodoListView
                node={enrichedSelectedNode}
                onUpdateNode={handleUpdateNode}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                focusMode={focusMode}
                loading={selectedTasksLoading}
              />
            )}

            {viewMode === "split" && (
              <SplitView
                nodes={enrichedNodes}
                selectedNode={enrichedSelectedNode}
                onSelectNode={setSelectedNode}
                onUpdateNode={handleUpdateNode}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddNode={handleAddNode}
                tasksLoading={selectedTasksLoading}
              />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
