"use client"

import type { Node } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, CheckCircle2, Circle } from "lucide-react"

interface SidebarProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onAddNode: () => void
}

export function Sidebar({ nodes, selectedNode, onSelectNode, onAddNode }: SidebarProps) {
  const getCompletionStats = (node: Node) => {
    const total = node.tasks?.length || 0
    const completed = node.tasks?.filter((task) => task.completed).length || 0
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Nodes</h2>
          <Button size="sm" onClick={onAddNode}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Nodes List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {nodes.map((node) => {
            const stats = getCompletionStats(node)
            const isSelected = selectedNode?.id === node.id

            return (
              <div
                key={node.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => onSelectNode(node)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{node.icon}</span>
                  <span className="font-medium text-sm truncate flex-1">{node.title}</span>
                </div>

                {stats.total > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {stats.completed === stats.total ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                    <span>
                      {stats.completed}/{stats.total} tasks
                    </span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{
                          width: `${stats.percentage}%`,
                          backgroundColor: node.color,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="p-4 border-t bg-white dark:bg-gray-800">
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Total Nodes:</span>
            <span>{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Tasks:</span>
            <span>{nodes.reduce((acc, node) => acc + (node.tasks?.length || 0), 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
