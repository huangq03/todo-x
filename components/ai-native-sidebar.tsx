"use client"

import type { Node, MindMap } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, CheckCircle2, Circle, Map, Sparkles, TrendingUp, Clock, Target, Zap, Brain } from "lucide-react"

interface AISidebarProps {
  mindmaps: MindMap[]
  selectedMindMap: MindMap | null
  onSelectMindMap: (mindmap: MindMap) => void
  onCreateMindMap: () => void
  onOpenAIChat: () => void
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onAddNode: () => void
}

export function AISidebar({
  mindmaps,
  selectedMindMap,
  onSelectMindMap,
  onCreateMindMap,
  onOpenAIChat,
  nodes,
  selectedNode,
  onSelectNode,
  onAddNode,
}: AISidebarProps) {
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
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    return { totalNodes, totalTasks, completedTasks, overallProgress }
  }

  const getAIInsights = () => {
    const stats = getTotalStats()
    if (stats.overallProgress >= 80)
      return { icon: "🎉", text: "Almost done! Great progress!", color: "text-green-600" }
    if (stats.overallProgress >= 50) return { icon: "🚀", text: "Making good progress!", color: "text-blue-600" }
    if (stats.overallProgress >= 20) return { icon: "💪", text: "Getting started!", color: "text-yellow-600" }
    return { icon: "✨", text: "Ready to begin!", color: "text-purple-600" }
  }

  const stats = getTotalStats()
  const insights = getAIInsights()

  return (
    <div className="w-80 border-r bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* AI Assistant Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          <Button
            size="sm"
            onClick={onOpenAIChat}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={onOpenAIChat}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Zap className="h-4 w-4 mr-2" />
          Generate Mind Map
        </Button>
      </div>

      {/* Mind Map Selector */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Map className="h-4 w-4" />
            Mind Maps
          </h3>
          <Button size="sm" variant="outline" onClick={onCreateMindMap}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {mindmaps.map((mindmap) => (
            <div
              key={mindmap.id}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedMindMap?.id === mindmap.id
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 shadow-sm"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => onSelectMindMap(mindmap)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mindmap.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{mindmap.title}</div>
                  {mindmap.description && (
                    <div className="text-xs text-muted-foreground truncate">{mindmap.description}</div>
                  )}
                </div>
                {selectedMindMap?.id === mindmap.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      {selectedMindMap && (
        <div className="p-4 border-b">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">AI Insights</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{insights.icon}</span>
                <span className={`text-sm font-medium ${insights.color}`}>{insights.text}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Overall Progress</span>
                  <span className="font-medium">{stats.overallProgress}%</span>
                </div>
                <Progress value={stats.overallProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{stats.totalNodes}</div>
                  <div className="text-muted-foreground">Nodes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{stats.completedTasks}</div>
                  <div className="text-muted-foreground">Done</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{stats.totalTasks - stats.completedTasks}</div>
                  <div className="text-muted-foreground">Todo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nodes List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Nodes
            </h3>
            <Button size="sm" variant="outline" onClick={onAddNode} disabled={!selectedMindMap}>
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
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 shadow-sm"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => onSelectNode(node)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{node.icon}</span>
                      <span className="font-medium text-sm truncate flex-1">{node.title}</span>
                      {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                    </div>

                    {stats.total > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          {stats.completed === stats.total ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">
                            {stats.completed}/{stats.total} tasks
                          </span>
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {stats.percentage}%
                          </Badge>
                        </div>
                        <Progress value={stats.percentage} className="h-1" />
                      </div>
                    )}

                    {stats.total === 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>No tasks yet</span>
                      </div>
                    )}
                  </div>
                )
              })}

              {nodes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-3xl mb-2">🧠</div>
                  <p className="text-sm mb-2">No nodes yet</p>
                  <Button size="sm" variant="outline" onClick={onOpenAIChat}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Generate with AI
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground p-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <p className="text-sm mb-3">Select a mind map</p>
                <Button
                  size="sm"
                  onClick={onOpenAIChat}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Create with AI
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
