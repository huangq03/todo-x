export interface Database {
  public: {
    Tables: {
      mindmaps: {
        Row: {
          id: string
          title: string
          description: string | null
          color: string
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          color: string
          icon: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          color?: string
          icon?: string
          created_at?: string
          updated_at?: string
        }
      }
      nodes: {
        Row: {
          id: string
          mindmap_id: string
          title: string
          x: number
          y: number
          color: string
          icon: string
          parent_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mindmap_id: string
          title: string
          x: number
          y: number
          color: string
          icon: string
          parent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mindmap_id?: string
          title?: string
          x?: number
          y?: number
          color?: string
          icon?: string
          parent_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          node_id: string
          title: string
          completed: boolean
          priority: "low" | "medium" | "high"
          due_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          node_id: string
          title: string
          completed?: boolean
          priority?: "low" | "medium" | "high"
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          node_id?: string
          title?: string
          completed?: boolean
          priority?: "low" | "medium" | "high"
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
