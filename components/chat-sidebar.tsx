"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Brain, MessageSquare } from "lucide-react"
import type { MindMap } from "@/types"

interface ChatSidebarProps {
  mindmaps: MindMap[]
  selectedMindMap: MindMap | null
  onSelectMindMap: (mindmap: MindMap) => void
  onNewChat: () => void
}

export function ChatSidebar({ mindmaps, selectedMindMap, onSelectMindMap, onNewChat }: ChatSidebarProps) {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-gray-600 dark:bg-gray-400 rounded flex items-center justify-center">
            <Brain className="h-4 w-4 text-white dark:text-gray-800" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">MindTask</span>
        </div>

        <Button
          onClick={onNewChat}
          variant="ghost"
          className="w-full justify-start text-sm font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Mind Map
        </Button>
      </div>

      {/* Mind Maps List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mindmaps.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No mind maps yet</p>
              <p className="text-xs mt-1">Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {mindmaps.map((mindmap) => (
                <button
                  key={mindmap.id}
                  onClick={() => onSelectMindMap(mindmap)}
                  className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                    selectedMindMap?.id === mindmap.id
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{mindmap.icon}</span>
                    <span className="font-medium truncate">{mindmap.title}</span>
                    {selectedMindMap?.id === mindmap.id && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mindmap.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
