"use client"

import type { Node } from "@/types"

interface ConnectionLinesProps {
  nodes: Node[]
}

export function ConnectionLines({ nodes }: ConnectionLinesProps) {
  const getConnections = () => {
    const connections: Array<{ from: Node; to: Node }> = []

    nodes.forEach((node) => {
      if (node.children) {
        node.children.forEach((childId) => {
          const childNode = nodes.find((n) => n.id === childId)
          if (childNode) {
            connections.push({ from: node, to: childNode })
          }
        })
      }
    })

    return connections
  }

  const connections = getConnections()

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {connections.map(({ from, to }, index) => {
        // Calculate control points for curved lines
        const dx = to.x - from.x
        const dy = to.y - from.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Control point offset (creates the curve)
        const controlOffset = Math.min(distance * 0.3, 100)

        const controlX1 = from.x + dx * 0.3
        const controlY1 = from.y - controlOffset
        const controlX2 = to.x - dx * 0.3
        const controlY2 = to.y - controlOffset

        return (
          <g key={index}>
            {/* Connection line */}
            <path
              d={`M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`}
              stroke={from.color}
              strokeWidth="2"
              fill="none"
              className="opacity-60"
              strokeDasharray="5,5"
            />

            {/* Arrow head */}
            <circle cx={to.x} cy={to.y} r="3" fill={from.color} className="opacity-80" />
          </g>
        )
      })}
    </svg>
  )
}
