import React from "react";
import { FaPlay, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./NodePalette.css";

// Array of node types with their labels, icons, and corresponding CSS class names
const nodeTypes = [
  { type: "start", label: "Start", icon: <FaPlay />, className: "start" },
  { type: "process", label: "Process", icon: <FaCog />, className: "process" },
  { type: "decision", label: "Decision", icon: <FaQuestionCircle />, className: "decision" },
];

const NodePalette = () => {
  
  const handleDragStart = (event, nodeType) => {
    
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("text/plain", nodeType); // Store a fallback plain text version of the node type
    event.dataTransfer.effectAllowed = "move"; // Specify that the action is to move the item
  };

  return (
    <div className="node-palette">
      <h3>Nodes</h3>
     
      {nodeTypes.map((node) => (
        <div
          key={node.type} // Ensure each element has a unique key
          className={`node-btn ${node.className}`} 
          draggable // Enable dragging functionality for the node
          onDragStart={(event) => handleDragStart(event, node.type)} // Handle drag start event
        >
          {node.icon} {node.label} {/* Display the node's icon and label */}
        </div>
      ))}
    </div>
  );
};

export default NodePalette;
