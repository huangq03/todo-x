"use client"

import type { Node, MindMap } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  CheckSquare,
  SplitSquareHorizontal,
  Focus,
  Settings,
  Moon,
  Sun,
  Database,
  Cloud,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"
import { USE_MOCK_API } from "@/lib/api-config"

interface HeaderProps {
  viewMode: "mindmap" | "todo" | "split"
  setViewMode: (mode: "mindmap" | "todo" | "split") => void
  focusMode: boolean
  setFocusMode: (focus: boolean) => void
  selectedNode: Node | null
  selectedMindMap: MindMap | null
  onOpenAIChat: () => void
}

export function Header({
  viewMode,
  setViewMode,
  focusMode,
  setFocusMode,
  selectedNode,
  selectedMindMap,
  onOpenAIChat,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg">MindTask</h1>
              <Badge variant={USE_MOCK_API ? "secondary" : "default"} className="text-xs">
                {USE_MOCK_API ? (
                  <>
                    <Database className="h-3 w-3 mr-1" />
                    Mock
                  </>
                ) : (
                  <>
                    <Cloud className="h-3 w-3 mr-1" />
                    Live
                  </>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedMindMap ? `${selectedMindMap.title}` : "Visual Productivity"}
            </p>
          </div>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === "mindmap" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mindmap")}
              className="gap-2"
              disabled={!selectedMindMap}
            >
              <Brain className="h-4 w-4" />
              Mind Map
            </Button>
            <Button
              variant={viewMode === "todo" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("todo")}
              disabled={!selectedNode}
              className="gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              Tasks
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="gap-2"
              disabled={!selectedMindMap}
            >
              <SplitSquareHorizontal className="h-4 w-4" />
              Split
            </Button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAIChat}
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
          >
            <Sparkles className="h-4 w-4" />
            AI Generate
          </Button>

          <Button
            variant={focusMode ? "default" : "outline"}
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2"
            disabled={!selectedNode}
          >
            <Focus className="h-4 w-4" />
            Focus
          </Button>

          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
