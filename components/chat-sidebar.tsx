"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Brain, Settings, Moon, Sun, Clock } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { SettingsDialog } from "./settings-dialog"
import type { MindMap } from "@/types"

interface ChatSidebarProps {
  mindmaps: MindMap[]
  selectedMindMap: MindMap | null
  onSelectMindMap: (mindmap: MindMap) => void
  onNewChat: () => void
}

export function ChatSidebar({ mindmaps, selectedMindMap, onSelectMindMap, onNewChat }: ChatSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 dark:bg-gray-400 rounded-md flex items-center justify-center">
              <Brain className="h-4 w-4 text-white dark:text-gray-900" />
            </div>
            <h1 className="font-medium text-base text-gray-700 dark:text-gray-300">MindTask</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={onNewChat}
          variant="ghost"
          className="w-full justify-start text-left font-normal hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-3" />
          New mind map
        </Button>
      </div>

      {/* Mind Maps List */}
      <div className="flex-1 overflow-hidden">
        <div className="p-3">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Recent Mind Maps</h2>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2">
            {mindmaps.map((mindmap) => (
              <div
                key={mindmap.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  selectedMindMap?.id === mindmap.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onClick={() => onSelectMindMap(mindmap)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <span className="text-sm">{mindmap.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-normal text-sm truncate text-gray-900 dark:text-gray-100">{mindmap.title}</h3>
                    {mindmap.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {mindmap.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(mindmap.updatedAt)}
                      </div>
                      {selectedMindMap?.id === mindmap.id && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mindmaps.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Brain className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No mind maps yet</p>
                <p className="text-xs">Create your first one!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">AI-powered mind mapping</div>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
