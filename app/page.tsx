"use client"

import { useState, useMemo } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { MindMapDisplay } from "@/components/mindmap-display"
import { NodeTaskModal } from "@/components/node-task-modal"
import { useMindMaps, useNodes, useAllNodeTasks, useTasks } from "@/hooks/use-api"
import type { Node, Task, MindMap } from "@/types"

export default function Home() {
  const { mindmaps, loading: mindmapsLoading, createMindMap } = useMindMaps()
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [taskModalNode, setTaskModalNode] = useState<Node | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Auto-select first mindmap when mindmaps load
  useMemo(() => {
    if (mindmaps.length > 0 && !selectedMindMap) {
      setSelectedMindMap(mindmaps[0])
    }
  }, [mindmaps, selectedMindMap])

  const { nodes, loading: nodesLoading, createNode, updateNode } = useNodes(selectedMindMap?.id || null)

  // Fetch all tasks for all nodes automatically
  const { nodeTasks, updateNodeTask, addNodeTask, removeNodeTask } = useAllNodeTasks(selectedMindMap?.id || null, nodes)

  // Fetch tasks for the task modal node
  const {
    tasks: modalNodeTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(selectedMindMap?.id || null, taskModalNode?.id || null)

  // Create enriched nodes with their tasks
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      tasks: nodeTasks[node.id] || [],
    }))
  }, [nodes, nodeTasks])

  // Create enriched task modal node with its tasks
  const enrichedTaskModalNode = useMemo(() => {
    if (!taskModalNode) return null
    return {
      ...taskModalNode,
      tasks: modalNodeTasks || nodeTasks[taskModalNode.id] || [],
    }
  }, [taskModalNode, modalNodeTasks, nodeTasks])

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

  const handleCreateNode = async (mindmapId: string, node: Node) => {
    try {
      const createdNode = await createNode(mindmapId, node)
      return createdNode
    } catch (error) {
      console.error("Failed to create AI node:", error)
      throw error
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

  const handleUpdateNode = async (nodeId: string, updates: Partial<Node>) => {
    if (!selectedMindMap) return

    try {
      await updateNode(selectedMindMap.id, nodeId, updates)
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } catch (error) {
      console.error("Failed to update node:", error)
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

  const handleNewChat = () => {
    setSelectedMindMap(null)
    setSelectedNode(null)
    setTaskModalNode(null)
  }

  const handleNodeDoubleClick = (node: Node) => {
    setTaskModalNode(node)
  }

  if (mindmapsLoading) {
    return (
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
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <ChatSidebar
        mindmaps={mindmaps}
        selectedMindMap={selectedMindMap}
        onSelectMindMap={setSelectedMindMap}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedMindMap && enrichedNodes.length > 0 ? (
          <MindMapDisplay
            mindmap={selectedMindMap}
            nodes={enrichedNodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onUpdateNode={handleUpdateNode}
            onNodeDoubleClick={handleNodeDoubleClick}
            isGenerating={isGenerating}
          />
        ) : (
          <ChatInterface
            onCreateMindMap={handleCreateMindMap}
            onCreateNode={handleCreateNode}
            onAddTask={handleAddTask}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}
      </div>

      {/* Node Task Modal */}
      <NodeTaskModal
        node={enrichedTaskModalNode}
        isOpen={!!taskModalNode}
        onClose={() => setTaskModalNode(null)}
        onAddTask={(nodeId, task) => handleAddTask(selectedMindMap!.id, nodeId, task)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
