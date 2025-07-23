"use client"

import type { Node } from "@/types"
import { Button } from "@/components/ui/button"
import { Brain, CheckSquare, SplitSquareHorizontal, Focus, Settings, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  viewMode: "mindmap" | "todo" | "split"
  setViewMode: (mode: "mindmap" | "todo" | "split") => void
  focusMode: boolean
  setFocusMode: (focus: boolean) => void
  selectedNode: Node | null
}

export function Header({ viewMode, setViewMode, focusMode, setFocusMode, selectedNode }: HeaderProps) {
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
            <h1 className="font-bold text-lg">MindTask</h1>
            <p className="text-xs text-muted-foreground">Visual Productivity</p>
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
            >
              <SplitSquareHorizontal className="h-4 w-4" />
              Split
            </Button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={focusMode ? "default" : "outline"}
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            className="gap-2"
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
