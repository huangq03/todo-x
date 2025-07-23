"use client"

import { useState, useEffect } from "react"
import type { Node, Task, MindMap } from "@/types"

// Hook for managing mind maps
export function useMindMaps() {
  const [mindmaps, setMindmaps] = useState<MindMap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMindMaps = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/mindmaps")
      if (!response.ok) throw new Error("Failed to fetch mind maps")
      const data = await response.json()
      setMindmaps(data.mindmaps)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createMindMap = async (mindmap: Omit<MindMap, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/mindmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mindmap),
      })
      if (!response.ok) throw new Error("Failed to create mind map")
      const data = await response.json()
      setMindmaps((prev) => [...prev, data.mindmap])
      return data.mindmap
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateMindMap = async (mindmapId: string, updates: Partial<MindMap>) => {
    try {
      const response = await fetch("/api/mindmaps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mindmapId, updates }),
      })
      if (!response.ok) throw new Error("Failed to update mind map")
      const data = await response.json()
      setMindmaps((prev) => prev.map((mindmap) => (mindmap.id === mindmapId ? data.mindmap : mindmap)))
      return data.mindmap
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteMindMap = async (mindmapId: string) => {
    try {
      const response = await fetch("/api/mindmaps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mindmapId }),
      })
      if (!response.ok) throw new Error("Failed to delete mind map")
      setMindmaps((prev) => prev.filter((mindmap) => mindmap.id !== mindmapId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchMindMaps()
  }, [])

  return { mindmaps, loading, error, createMindMap, updateMindMap, deleteMindMap, refetch: fetchMindMaps }
}

// Hook for managing nodes within a specific mind map
export function useNodes(mindmapId: string | null) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNodes = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/mindmaps/${id}/nodes`)
      if (!response.ok) throw new Error("Failed to fetch nodes")
      const data = await response.json()
      setNodes(data.nodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createNode = async (mindmapId: string, node: Node) => {
    try {
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(node),
      })
      if (!response.ok) throw new Error("Failed to create node")
      const data = await response.json()
      setNodes((prev) => [...prev, data.node])
      return data.node
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateNode = async (mindmapId: string, nodeId: string, updates: Partial<Node>) => {
    try {
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: nodeId, updates }),
      })
      if (!response.ok) throw new Error("Failed to update node")
      const data = await response.json()
      setNodes((prev) => prev.map((node) => (node.id === nodeId ? data.node : node)))
      return data.node
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    if (mindmapId) {
      fetchNodes(mindmapId)
    } else {
      setNodes([])
    }
  }, [mindmapId])

  return { nodes, loading, error, createNode, updateNode, refetch: () => mindmapId && fetchNodes(mindmapId) }
}

// Hook for managing tasks within a specific node
export function useTasks(mindmapId: string | null, nodeId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (mindmapId: string, nodeId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes/${nodeId}/tasks`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data.tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (mindmapId: string, nodeId: string, task: Omit<Task, "id">) => {
    try {
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes/${nodeId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error("Failed to create task")
      const data = await response.json()
      setTasks((prev) => [...prev, data.task])
      return data.task
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateTask = async (mindmapId: string, nodeId: string, taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes/${nodeId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update task")
      const data = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === taskId ? data.task : task)))
      return data.task
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteTask = async (mindmapId: string, nodeId: string, taskId: string) => {
    try {
      const response = await fetch(`/api/mindmaps/${mindmapId}/nodes/${nodeId}/tasks/${taskId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete task")
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    if (mindmapId && nodeId) {
      fetchTasks(mindmapId, nodeId)
    } else {
      setTasks([])
    }
  }, [mindmapId, nodeId])

  return { tasks, loading, error, createTask, updateTask, deleteTask }
}

// Hook for fetching all tasks for all nodes in a mind map
export function useAllNodeTasks(mindmapId: string | null, nodes: Node[]) {
  const [nodeTasks, setNodeTasks] = useState<Record<string, Task[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllTasks = async () => {
    if (!mindmapId || nodes.length === 0) return

    try {
      setLoading(true)
      setError(null)

      // Fetch tasks for all nodes in parallel
      const taskPromises = nodes.map(async (node) => {
        const response = await fetch(`/api/mindmaps/${mindmapId}/nodes/${node.id}/tasks`)
        if (!response.ok) throw new Error(`Failed to fetch tasks for node ${node.id}`)
        const data = await response.json()
        return { nodeId: node.id, tasks: data.tasks }
      })

      const results = await Promise.all(taskPromises)

      // Convert array to object for easy lookup
      const tasksMap = results.reduce(
        (acc, { nodeId, tasks }) => {
          acc[nodeId] = tasks
          return acc
        },
        {} as Record<string, Task[]>,
      )

      setNodeTasks(tasksMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const updateNodeTask = (nodeId: string, taskId: string, updates: Partial<Task>) => {
    setNodeTasks((prev) => ({
      ...prev,
      [nodeId]: prev[nodeId]?.map((task) => (task.id === taskId ? { ...task, ...updates } : task)) || [],
    }))
  }

  const addNodeTask = (nodeId: string, task: Task) => {
    setNodeTasks((prev) => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), task],
    }))
  }

  const removeNodeTask = (nodeId: string, taskId: string) => {
    setNodeTasks((prev) => ({
      ...prev,
      [nodeId]: prev[nodeId]?.filter((task) => task.id !== taskId) || [],
    }))
  }

  useEffect(() => {
    fetchAllTasks()
  }, [mindmapId, nodes.length])

  return {
    nodeTasks,
    loading,
    error,
    updateNodeTask,
    addNodeTask,
    removeNodeTask,
    refetch: fetchAllTasks,
  }
}
