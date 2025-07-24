"use client"

import { useState, useMemo } from "react"
import { TodoListView } from "@/components/todo-list-view"
import { SplitView } from "@/components/split-view"
import { AIHeader } from "@/components/ai-native-header"
import { AISidebar } from "@/components/ai-native-sidebar"
import { AIMindMapView } from "@/components/ai-mind-map-view"
import { AIChat } from "@/components/ai-chat"
import { ThemeProvider } from "next-themes"
import { useMindMaps, useNodes, useTasks, useAllNodeTasks } from "@/hooks/use-api"
import type { Node, Task, MindMap } from "@/types"

export default function Home() {
  const { mindmaps, loading: mindmapsLoading, error: mindmapsError, createMindMap } = useMindMaps()
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewMode, setViewMode] = useState<"mindmap" | "todo" | "split">("mindmap")
  const [focusMode, setFocusMode] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

  // Auto-select first mindmap when mindmaps load
  useMemo(() => {
    if (mindmaps.length > 0 && !selectedMindMap) {
      setSelectedMindMap(mindmaps[0])
    }
  }, [mindmaps, selectedMindMap])

  const {
    nodes,
    loading: nodesLoading,
    error: nodesError,
    createNode,
    updateNode,
  } = useNodes(selectedMindMap?.id || null)

  // Fetch all tasks for all nodes automatically
  const {
    nodeTasks,
    loading: allTasksLoading,
    error: allTasksError,
    updateNodeTask,
    addNodeTask,
    removeNodeTask,
  } = useAllNodeTasks(selectedMindMap?.id || null, nodes)

  // Fetch tasks for the selected node (for real-time updates)
  const {
    tasks: selectedNodeTasks,
    loading: selectedTasksLoading,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(selectedMindMap?.id || null, selectedNode?.id || null)

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

  const handleSelectMindMap = (mindmap: MindMap) => {
    setSelectedMindMap(mindmap)
    setSelectedNode(null) // Clear selected node when switching mind maps
  }

  const handleCreateMindMap = async (mindmapData: Omit<MindMap, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newMindMap = await createMindMap(mindmapData)
      setSelectedMindMap(newMindMap)
      return newMindMap
    } catch (error) {
      console.error("Failed to create mind map:", error)
      throw error
    }
  }

  const handleCreateMindMapFromSidebar = async () => {
    try {
      const newMindMap = await createMindMap({
        title: "New Mind Map",
        description: "A new mind map for organizing thoughts",
        color: "#6B7280",
        icon: "🧠",
      })
      setSelectedMindMap(newMindMap)
    } catch (error) {
      console.error("Failed to create mind map:", error)
    }
  }

  const handleUpdateNode = async (nodeId: string, updates: Partial<Node>) => {
    if (!selectedMindMap) return

    try {
      await updateNode(selectedMindMap.id, nodeId, updates)
      // Update selected node if it's the one being updated
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } catch (error) {
      console.error("Failed to update node:", error)
    }
  }

  const handleAddTask = async (mindmapId: string, nodeId: string, task: Omit<Task, "id">) => {
    try {
      const newTask = await createTask(mindmapId, nodeId, task)
      // Update the all tasks cache
      addNodeTask(nodeId, newTask)
      return newTask
    } catch (error) {
      console.error("Failed to add task:", error)
      throw error
    }
  }

  const handleUpdateTask = async (nodeId: string, taskId: string, updates: Partial<Task>) => {
    if (!selectedMindMap) return

    try {
      await updateTask(selectedMindMap.id, nodeId, taskId, updates)
      // Update the all tasks cache
      updateNodeTask(nodeId, taskId, updates)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (nodeId: string, taskId: string) => {
    if (!selectedMindMap) return

    try {
      await deleteTask(selectedMindMap.id, nodeId, taskId)
      // Update the all tasks cache
      removeNodeTask(nodeId, taskId)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleAddNode = async (parentId?: string) => {
    if (!selectedMindMap) return

    const newNode: Node = {
      id: Date.now().toString(),
      title: "New Node",
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      color: "#6B7280",
      icon: "📋",
      parent: parentId,
      mindmapId: selectedMindMap.id,
    }

    try {
      const createdNode = await createNode(selectedMindMap.id, newNode)
      return createdNode
    } catch (error) {
      console.error("Failed to add node:", error)
      throw error
    }
  }

  // Special handler for AI-generated nodes that preserves the exact structure
  const handleCreateAINode = async (mindmapId: string, node: Node) => {
    try {
      const createdNode = await createNode(mindmapId, node)
      return createdNode
    } catch (error) {
      console.error("Failed to create AI node:", error)
      throw error
    }
  }

  const isLoading = mindmapsLoading || nodesLoading || allTasksLoading
  const hasError = mindmapsError || nodesError || allTasksError

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-slate-900 dark:to-pink-950">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500 mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Loading MindTask AI
            </h2>
            <p className="text-muted-foreground">Preparing your intelligent workspace...</p>
            {allTasksLoading && <p className="text-sm text-muted-foreground mt-2">Syncing tasks...</p>}
          </div>
        </div>
      </ThemeProvider>
    )
  }

  if (hasError) {
    return (
      <ThemeProvider>
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950 dark:via-slate-900 dark:to-orange-950">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="text-muted-foreground mb-4">{mindmapsError || nodesError || allTasksError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <AIHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          selectedNode={enrichedSelectedNode}
          selectedMindMap={selectedMindMap}
          onOpenAIChat={() => setIsAIChatOpen(true)}
        />

        <div className="flex-1 flex">
          <AISidebar
            mindmaps={mindmaps}
            selectedMindMap={selectedMindMap}
            onSelectMindMap={handleSelectMindMap}
            onCreateMindMap={handleCreateMindMapFromSidebar}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            nodes={enrichedNodes}
            selectedNode={enrichedSelectedNode}
            onSelectNode={setSelectedNode}
            onAddNode={handleAddNode}
          />

          <main className="flex-1">
            {viewMode === "mindmap" && (
              <AIMindMapView
                nodes={enrichedNodes}
                selectedNode={enrichedSelectedNode}
                onSelectNode={setSelectedNode}
                onUpdateNode={handleUpdateNode}
                onAddNode={handleAddNode}
                onOpenAIChat={() => setIsAIChatOpen(true)}
              />
            )}

            {viewMode === "todo" && enrichedSelectedNode && (
              <TodoListView
                node={enrichedSelectedNode}
                onUpdateNode={handleUpdateNode}
                onAddTask={(nodeId, task) => handleAddTask(selectedMindMap!.id, nodeId, task)}
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
                onAddTask={(nodeId, task) => handleAddTask(selectedMindMap!.id, nodeId, task)}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddNode={handleAddNode}
                tasksLoading={selectedTasksLoading}
              />
            )}
          </main>
        </div>

        {/* AI Chat Modal */}
        <AIChat
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          onCreateMindMap={handleCreateMindMap}
          onCreateNode={handleCreateAINode}
          onAddTask={handleAddTask}
        />
      </div>
    </ThemeProvider>
  )
}
