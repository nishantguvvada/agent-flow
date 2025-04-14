"use client";
// components/GetWeatherNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const GetWeatherNode = ({ data }) => (
  <div style={{ padding: 10, backgroundColor: '#e3f2fd', border: '1px solid #222', borderRadius: 5, position: 'relative' }}>
    <div>{data.label || 'Get Weather Node'}</div>
    {/* As a tool node, it accepts connections on the left */}
    <Handle id="toolSource" type="source" position={Position.Left} style={{ background: '#555', width: 12, height: 12 }} />
  </div>
);

export default GetWeatherNode;
