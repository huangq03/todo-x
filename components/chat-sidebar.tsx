"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Brain } from "lucide-react"
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
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <Brain className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">MindTask</span>
        </div>

        <Button
          onClick={onNewChat}
          variant="ghost"
          className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <p className="text-xs">Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {mindmaps.map((mindmap) => (
                <div
                  key={mindmap.id}
                  onClick={() => onSelectMindMap(mindmap)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMindMap?.id === mindmap.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0">{mindmap.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{mindmap.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {mindmap.description}
                      </p>
                    </div>
                    {selectedMindMap?.id === mindmap.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
