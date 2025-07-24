"use client"

import type { Node, MindMap } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Search,
  Zap,
  MessageCircle,
  Wand2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { USE_MOCK_API } from "@/lib/api-config"
import { useState } from "react"
import { SettingsDialog } from "./settings-dialog"

interface AIHeaderProps {
  viewMode: "mindmap" | "todo" | "split"
  setViewMode: (mode: "mindmap" | "todo" | "split") => void
  focusMode: boolean
  setFocusMode: (focus: boolean) => void
  selectedNode: Node | null
  selectedMindMap: MindMap | null
  onOpenAIChat: () => void
}

export function AIHeader({
  viewMode,
  setViewMode,
  focusMode,
  setFocusMode,
  selectedNode,
  selectedMindMap,
  onOpenAIChat,
}: AIHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const getAISuggestion = () => {
    if (!selectedMindMap) return "Create your first mind map with AI"
    if (!selectedNode) return "Select a node to get AI suggestions"
    return "Ask AI to add tasks or expand this node"
  }

  return (
    <div className="relative">
      {/* Main Header */}
      <header className="border-b bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo with AI Glow */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MindTask AI
                </h1>
                <Badge variant={USE_MOCK_API ? "secondary" : "default"} className="text-xs animate-pulse">
                  {USE_MOCK_API ? (
                    <>
                      <Database className="h-3 w-3 mr-1" />
                      Demo
                    </>
                  ) : (
                    <>
                      <Cloud className="h-3 w-3 mr-1" />
                      Live
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedMindMap ? `${selectedMindMap.title}` : "AI-Powered Visual Productivity"}
              </p>
            </div>
          </div>

          {/* AI Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ask AI anything about your mind map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-purple-300 dark:focus:border-purple-600 transition-all duration-200"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={onOpenAIChat}
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="px-6 pb-4 flex items-center justify-between">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Button
              variant={viewMode === "mindmap" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mindmap")}
              className={`gap-2 rounded-lg transition-all duration-200 ${
                viewMode === "mindmap"
                  ? "bg-white dark:bg-slate-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
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
              className={`gap-2 rounded-lg transition-all duration-200 ${
                viewMode === "todo"
                  ? "bg-white dark:bg-slate-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              Tasks
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className={`gap-2 rounded-lg transition-all duration-200 ${
                viewMode === "split"
                  ? "bg-white dark:bg-slate-700 shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
              disabled={!selectedMindMap}
            >
              <SplitSquareHorizontal className="h-4 w-4" />
              Split
            </Button>
          </div>

          {/* AI Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAIChat}
              className="gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900 dark:hover:to-cyan-900 transition-all duration-200"
              disabled={!selectedNode}
            >
              <Wand2 className="h-4 w-4" />
              AI Enhance
            </Button>

            <Button
              variant={focusMode ? "default" : "outline"}
              size="sm"
              onClick={() => setFocusMode(!focusMode)}
              className="gap-2 transition-all duration-200"
              disabled={!selectedNode}
            >
              <Focus className="h-4 w-4" />
              Focus
            </Button>
          </div>
        </div>
      </header>

      {/* AI Suggestion Bar */}
      {selectedMindMap && (
        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 border-b border-purple-200/20 dark:border-purple-800/20">
          <div className="px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">{getAISuggestion()}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onOpenAIChat}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Try it →
            </Button>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
