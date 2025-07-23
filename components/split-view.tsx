"use client"

import type { Node, Task } from "@/types"
import { MindMapView } from "./mind-map-view"
import { TodoListView } from "./todo-list-view"

interface SplitViewProps {
  nodes: Node[]
  selectedNode: Node | null
  onSelectNode: (node: Node) => void
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void
  onAddTask: (nodeId: string, task: Omit<Task, "id">) => void
  onUpdateTask: (nodeId: string, taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (nodeId: string, taskId: string) => void
  onAddNode: (parentId?: string) => void
}

export function SplitView({
  nodes,
  selectedNode,
  onSelectNode,
  onUpdateNode,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddNode,
}: SplitViewProps) {
  return (
    <div className="h-full flex">
      {/* Mind Map Side */}
      <div className="w-1/2 border-r">
        <MindMapView
          nodes={nodes}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          onUpdateNode={onUpdateNode}
          onAddNode={onAddNode}
        />
      </div>

      {/* Todo List Side */}
      <div className="w-1/2">
        {selectedNode ? (
          <TodoListView
            node={selectedNode}
            onUpdateNode={onUpdateNode}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-4">👈</div>
              <h3 className="text-lg font-medium mb-2">Select a Node</h3>
              <p>Click on a node in the mind map to view its tasks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
