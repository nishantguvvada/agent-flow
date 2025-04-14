"use client"
import React, { useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Handle,
  Position,
  Background,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import FetchProductNode from './FetchProductNode';
import GetWeatherNode from './GetWeatherNode';
import ChatNode from './ChatNode';
import axios from 'axios';

// Agent node: allows edges to be created from its right side
const AgentNode = ({ data }) => (
  <div style={{ padding: 10, border: '1px solid #222', borderRadius: 5, backgroundColor: '#fff', position: 'relative' }}>
    {data.label}
    {/* Source handle on the right */}
    <Handle
      id="chatHandle"
      type="source"
      position={Position.Right}
      style={{ background: '#555', width: 12, height: 12 }}
    />
    <Handle
      id="toolHandle"
      type="target"
      position={Position.Bottom}
      style={{ background: '#555', width: 12, height: 12 }}
    />
  </div>
);

// Map custom node types to components
const nodeTypes = {
  agentNode: AgentNode,
  fetchProductNode: FetchProductNode,
  getWeatherNode: GetWeatherNode,
  chatNode: ChatNode,
};

// Initial nodes positioned for easy viewing
const initialNodes = [
  {
    id: '1',
    type: 'agentNode',
    data: { label: 'Agent Node' },
    position: { x: 100, y: 500 },
  },
  {
    id: '2',
    type: 'fetchProductNode',
    data: { label: 'Fetch Product' },
    position: { x: 300, y: 500 },
  },
  {
    id: '3',
    type: 'getWeatherNode',
    data: { label: 'Get Weather' },
    position: { x: 500, y: 500 },
  },
  {
    id: '4',
    type: 'chatNode',
    data: { label: 'Chat Output Node' },
    position: { x: 700, y: 500 },
  },
];

const initialEdges = [
];

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));

  const onConnect = async (params) => {
    const { source, target, sourceHandle, targetHandle } = params;
    // Find the source and target nodes from the current nodes list
    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);

    if (!sourceNode || !targetNode) return;

    // Case 1: Agent Node -> Chat Output
    if (sourceNode.type === 'agentNode' && sourceHandle === 'chatHandle') {
      if (targetNode.type !== 'chatNode') {
        console.log("Agent Node's chat handle can only connect to a Chat Output Node.");
        return;
      }
    }
    // Case 2: Tool Node -> Agent Node (using tool connection)
    else if (targetNode.type === 'agentNode' && targetHandle === 'toolHandle') {
      if (sourceNode.type !== 'fetchProductNode' && sourceNode.type !== 'getWeatherNode') {
        console.log("Only a tool node (Fetch Product or Get Weather) can connect to an Agent Node's tool handle.");
        return;
      }
    }
    // Any other connection is invalid.
    else {
      console.log("Invalid connection. Allowed connections: Agent (chatHandle) → Chat, or Tool → Agent (toolHandle).");
      return;
    }

    const toolMap = {
      fetchProductNode: 'getproduct_tool',
      getWeatherNode: 'getweather_tool',
    };

    // console.log("TargetNode", targetNode);
    // console.log("SourceNode", sourceNode);
  
    const toolName = toolMap[sourceNode.type];
    if (toolName) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/connect_tool`,{
          tool_name: toolName 
        });
        toast.success("Node connection successful!");
        // console.log(response);
      } catch(err) {
        toast.error("Node connection error!");
        console.log("Error connecting tool to agent:", err)
      }
    }

    setEdges((eds) => addEdge(params, eds));
  };

  return (
    <div className="flex justify-center items-center ">
    <div className="border rounded-xl m-8" style={{ width: '70%', height: '50vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        // Ensures that the nodes remain draggable
        nodesDraggable={true}
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
    </div>
  );
}