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
