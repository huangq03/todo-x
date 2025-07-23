export interface Task {
  id: string
  title: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  dueDate?: string
  notes?: string
}

export interface Node {
  id: string
  title: string
  x: number
  y: number
  color: string
  icon: string
  tasks?: Task[]
  children?: string[]
  parent?: string
  notes?: string
}
