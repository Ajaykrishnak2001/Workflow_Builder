// NodePalette.js - Modified with button approach for mobile
import React, { useState, useEffect } from "react";
import { FaPlay, FaCog, FaQuestionCircle } from "react-icons/fa";
import "./NodePalette.css";
import { useDispatch } from "react-redux";
import { addNode } from "../../redux/workflowSlice";
import { useReactFlow } from "reactflow";

// Array of node types with their labels, icons, and corresponding CSS class names
const nodeTypes = [
  { type: "start", label: "Start", icon: <FaPlay />, className: "start" },
  { type: "process", label: "Process", icon: <FaCog />, className: "process" },
  { type: "decision", label: "Decision", icon: <FaQuestionCircle />, className: "decision" },
];

const NodePalette = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dispatch = useDispatch();
  const { getViewport } = useReactFlow();
  
  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("text/plain", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  
  // For mobile: Add node directly when clicked
  const handleAddNode = (nodeType) => {
    // Get the center of the current view
    const { x, y, zoom } = getViewport();
    
    // Calculate center position based on current viewport
    const viewportCenter = {
      x: window.innerWidth / 2 / zoom - x / zoom,
      y: window.innerHeight / 2 / zoom - y / zoom
    };
    
    // Add node at the center of the viewport
    dispatch(addNode({ 
      type: nodeType, 
      position: viewportCenter 
    }));
  };

  return (
    <div className="node-palette">
      <h3>Nodes</h3>
      
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className={`node-btn ${node.className}`}
          // Desktop: Draggable nodes
          // Mobile: Clickable buttons
          draggable={!isMobile}
          onDragStart={!isMobile ? (event) => handleDragStart(event, node.type) : null}
          onClick={isMobile ? () => handleAddNode(node.type) : null}
        >
          {node.icon} {node.label}
          
        </div>
      ))}
      
      {isMobile && (
        <div className="mobile-instructions">
          Tap a node to add it to the center of the canvas
        </div>
      )}
    </div>
  );
};

export default NodePalette;