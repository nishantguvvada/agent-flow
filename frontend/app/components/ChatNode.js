"use client";
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatNode = ({ data }) => {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  const handleSend = async () => {
    // Implement the logic to send inputValue to the agent
    console.log('Sending message to agent:', inputValue);
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ask`,{
          user_query: inputValue 
        });
        toast.success("Response received!");
        setOutputValue(response.data.response)
      } catch(err) {
        toast.error("Error invoking agent!");
        console.log("Error invoking agent:", err)
      }
    setInputValue('');
  };

  return (
    <div style={{
      padding: 10,
      border: '1px solid #222',
      borderRadius: 5,
      backgroundColor: '#ffebee',
      position: 'relative',
      width: 200
    }}>
      <Handle
        id="chatTarget"
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: 12, height: 12 }}
      />
      <div style={{ marginBottom: 5 }}>{data.label}</div>
      <textarea readOnly rows={8} type="text" className="w-full nodrag px-2 text-sm bg-white border rounded-lg" value={outputValue} style={{ marginBottom: 5 }}/>
      <textarea
        rows={2}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="nodrag bg-white border rounded-lg p-2"
        style={{ width: '100%', marginBottom: 5 }}
      />
      <button className="shadow-lg bg-rose-400 rounded-lg cursor-pointer" onClick={handleSend} style={{ width: '100%' }}>
        Send
      </button>
    </div>
  );
};

export default ChatNode;
