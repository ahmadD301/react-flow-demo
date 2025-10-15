import React, { useCallback, useMemo, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
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

  const [positions, setPositions] = useState(
    initialNodes.reduce((acc, node) => {
      acc[node.id] = node.position
      return acc
    }, {})
  )

  const [nodeCount, setNodeCount] = useState(initialNodes.length)
  const [selectedNode, setSelectedNode] = useState(null) // Track selected node

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeDragStop = useCallback((_, node) => {
    setPositions((prev) => ({
      ...prev,
      [node.id]: node.position,
    }))
  }, [])

  // Track selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id)
  }, [])

  // Add a new node
  const addNode = useCallback(() => {
    const newId = `${nodeCount + 1}`
    const newNode = {
      id: newId,
      data: { label: `Node ${newId}` },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
    }

    setNodes((nds) => nds.concat(newNode))
    setPositions((prev) => ({ ...prev, [newId]: newNode.position }))
    setNodeCount((count) => count + 1)
  }, [nodeCount, setNodes])

  // Remove selected node
  const removeNode = useCallback(() => {
    if (!selectedNode) return

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode))
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode))

    setPositions((prev) => {
      const newPositions = { ...prev }
      delete newPositions[selectedNode]
      return newPositions
    })

    setSelectedNode(null)
  }, [selectedNode, setNodes, setEdges, setPositions])

  const nodeTypes = useMemo(() => ({}), [])
  const edgeTypes = useMemo(() => ({}), [])

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Buttons */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <button
          onClick={addNode}
          style={{
            padding: "10px 15px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Add Node
        </button>

        <button
          onClick={removeNode}
          style={{
            padding: "10px 15px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: selectedNode ? "pointer" : "not-allowed",
            opacity: selectedNode ? 1 : 0.5,
          }}
          disabled={!selectedNode}
        >
          Remove Selected Node
        </button>
      </div>

      {/* Flow Canvas */}
      <div
        style={{
          width: "600px",
          height: "500px",
          border: "1px solid #ccc",
          borderRadius: 8,
          overflow: "hidden",
          margin: "auto",
          marginTop: "50px",
          position: "relative",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        {/* Display coordinates */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "#222",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: "8px",
            fontFamily: "monospace",
          }}
        >
          {Object.entries(positions).map(([id, pos]) => (
            <p key={id}>
              Node {id}: X: {Math.round(pos.x)} | Y: {Math.round(pos.y)}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
