"use client"

import { useState, useEffect } from "react"
import type { Node, Task } from "@/types"

// Custom hook for API calls
export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNodes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/nodes")
      if (!response.ok) throw new Error("Failed to fetch nodes")
      const data = await response.json()
      setNodes(data.nodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createNode = async (node: Node) => {
    try {
      const response = await fetch("/api/nodes", {
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

  const updateNode = async (nodeId: string, updates: Partial<Node>) => {
    try {
      const response = await fetch("/api/nodes", {
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
    fetchNodes()
  }, [])

  return { nodes, loading, error, createNode, updateNode, refetch: fetchNodes }
}

export function useTasks(nodeId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/nodes/${id}/tasks`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data.tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (id: string, task: Omit<Task, "id">) => {
    try {
      const response = await fetch(`/api/nodes/${id}/tasks`, {
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

  const updateTask = async (id: string, taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/nodes/${id}/tasks/${taskId}`, {
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

  const deleteTask = async (id: string, taskId: string) => {
    try {
      const response = await fetch(`/api/nodes/${id}/tasks/${taskId}`, {
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
    if (nodeId) {
      fetchTasks(nodeId)
    } else {
      setTasks([])
    }
  }, [nodeId])

  return { tasks, loading, error, createTask, updateTask, deleteTask }
}

export function useAllNodeTasks(nodes: Node[]) {
  const [nodeTasks, setNodeTasks] = useState<Record<string, Task[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllTasks = async () => {
    if (nodes.length === 0) return

    try {
      setLoading(true)
      setError(null)

      // Fetch tasks for all nodes in parallel
      const taskPromises = nodes.map(async (node) => {
        const response = await fetch(`/api/nodes/${node.id}/tasks`)
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
  }, [nodes.length]) // Re-fetch when nodes change

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
