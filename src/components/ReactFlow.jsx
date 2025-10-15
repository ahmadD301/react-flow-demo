import React, { useCallback, useMemo, useState } from "react"

import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow"
import "reactflow/dist/style.css"

const initialNodes = [
  { id: "1", position: { x: 250, y: 0 }, data: { label: "Start Node" } },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "End Node" } },
]

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

export default function FlowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  
  const nodeTypes = useMemo(() => ({}), [])
  const edgeTypes = useMemo(() => ({}), [])

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "blue",
      }}
    >
      <div
        style={{
          width: "600px",
          height: "500px",
          border: "1px solid #ccc",
          background: "white",
          borderRadius: 8,
          overflow: "hidden", // ensures no overflow
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
}
