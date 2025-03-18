import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateNode, clearSelectedNode } from "../../redux/workflowSlice";
import "./PropertiesPanel.css";

const PropertiesPanel = () => {
 
  const selectedNode = useSelector((state) => state.workflow.selectedNode);
  const dispatch = useDispatch();

  // Local state to hold the label and description of the selected node
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  // Effect hook to update the local state when the selected node changes
  useEffect(() => {
    if (selectedNode) {
      
      setLabel(selectedNode.data.label || "");
      setDescription(selectedNode.data.description || "");
    }
  }, [selectedNode]);

  // Handle the save action to update the node in the Redux store
  const handleSave = () => {
    if (selectedNode) {
      
      dispatch(updateNode({ id: selectedNode.id, data: { label, description } }));
    }
  };

  // Handle the cancel action to clear the selected node and hide the properties panel
  const handleCancel = () => {
    dispatch(clearSelectedNode()); // Dispatch action to clear selected node
  };

  // If no node is selected, hide the properties panel
  if (!selectedNode) {
    return null; 
  }

  return (
    <div className="properties-panel">
      <h3>Node Properties</h3>
      
      <div className="input-group">
        <label>Label:</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)} 
        />
      </div>
      
      <div className="input-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      
      <div className="button-group">
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
