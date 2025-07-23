"use client"

import type { Node, MindMap } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle2, Circle, Map, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SidebarProps {
  mindmaps: MindMap[]
  selectedMindMap: MindMap | null
  onSelectMindMap: (mindmap: MindMap) => void
  onCreateMindMap: () => void
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onAddNode: () => void
}

export function Sidebar({
  mindmaps,
  selectedMindMap,
  onSelectMindMap,
  onCreateMindMap,
  nodes,
  selectedNode,
  onSelectNode,
  onAddNode,
}: SidebarProps) {
  const getCompletionStats = (node: Node) => {
    const total = node.tasks?.length || 0
    const completed = node.tasks?.filter((task) => task.completed).length || 0
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const getTotalStats = () => {
    const totalNodes = nodes.length
    const totalTasks = nodes.reduce((acc, node) => acc + (node.tasks?.length || 0), 0)
    const completedTasks = nodes.reduce(
      (acc, node) => acc + (node.tasks?.filter((task) => task.completed).length || 0),
      0,
    )
    return { totalNodes, totalTasks, completedTasks }
  }

  const stats = getTotalStats()

  return (
    <div className="w-80 border-r bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Mind Map Selector */}
      <div className="p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Map className="h-4 w-4" />
            Mind Maps
          </h2>
          <Button size="sm" onClick={onCreateMindMap}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={selectedMindMap?.id || ""}
          onValueChange={(value) => {
            const mindmap = mindmaps.find((m) => m.id === value)
            if (mindmap) onSelectMindMap(mindmap)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a mind map">
              {selectedMindMap && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedMindMap.icon}</span>
                  <span className="truncate">{selectedMindMap.title}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {mindmaps.map((mindmap) => (
              <SelectItem key={mindmap.id} value={mindmap.id}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mindmap.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{mindmap.title}</div>
                    {mindmap.description && <div className="text-xs text-muted-foreground">{mindmap.description}</div>}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMindMap && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Mind Map Stats</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit Mind Map</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span>{stats.totalNodes}</span>
              </div>
              <div className="flex justify-between">
                <span>Tasks:</span>
                <span>
                  {stats.completedTasks}/{stats.totalTasks}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Progress:</span>
                <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nodes List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Nodes</h3>
            <Button size="sm" onClick={onAddNode} disabled={!selectedMindMap}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {selectedMindMap ? (
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

              {nodes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-3xl mb-2">🧠</div>
                  <p className="text-sm">No nodes yet</p>
                  <p className="text-xs">Click + to add your first node</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <p className="text-sm">Select a mind map</p>
                <p className="text-xs">Choose from the dropdown above</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
