import { createSlice } from "@reduxjs/toolkit";

// Initial state of the workflow, with nodes, edges, and selectedNode set to default values
const initialState = {
  nodes: [], 
  edges: [], 
  selectedNode: null,
};

const workflowSlice = createSlice({
  name: "workflow", 
  initialState, 
  reducers: {
    // Action to add a new node to the workflow
    addNode: (state, action) => {
      const { type, position } = action.payload; // Extract type and position from payload
      const newNode = {
        id: `${type}-${Date.now()}`, // Unique id for the node (based on type and timestamp)
        type, 
        position, // Position of the node in the workflow
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1),
          description: "" 
        },
      };
      state.nodes.push(newNode); // Add the new node to the state
    },

    // Action to add a connection (edge) between two nodes
    addConnection: (state, action) => {
      state.edges.push(action.payload); 
    },

    // Action to remove a node and any associated edges
    removeNode: (state, action) => {
      const nodeId = action.payload; 
      state.nodes = state.nodes.filter((node) => node.id !== nodeId); 
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId 
      );

      
      if (state.selectedNode?.id === nodeId) {
        state.selectedNode = null;
      }
    },

    // Action to select a node (set it as the currently selected node)
    selectNode: (state, action) => {
      state.selectedNode = state.nodes.find(node => node.id === action.payload) || null; 
    },

    // Action to update the properties of a node
    updateNode: (state, action) => {
      const { id, data } = action.payload; 
      const node = state.nodes.find((node) => node.id === id); 

      if (node) {
        node.data = { ...node.data, ...data }; // Merge the new data with the existing node's data

        
        if (state.selectedNode?.id === id) {
          state.selectedNode = { ...node };
        }
      }
    },

    
    clearSelectedNode: (state) => {
      state.selectedNode = null; 
    },

    // Action to save the current workflow to local storage
    saveWorkflow: (state) => {
      localStorage.setItem("workflowNodes", JSON.stringify(state.nodes)); 
      localStorage.setItem("workflowEdges", JSON.stringify(state.edges)); 
    },

    // Action to load the workflow from local storage
    loadWorkflow: (state) => {
      try {
        // Try to load saved nodes and edges from localStorage
        const savedNodes = JSON.parse(localStorage.getItem("workflowNodes")) || [];
        const savedEdges = JSON.parse(localStorage.getItem("workflowEdges")) || [];

        state.nodes = savedNodes; 
        state.edges = savedEdges; 
        state.selectedNode = null; 
      } catch (error) {
        
        console.error("Error loading workflow:", error);
        state.nodes = [];
        state.edges = [];
      }
    },
  },
});

// Exporting the actions for use in components
export const {
  addNode,
  addConnection,
  removeNode,
  selectNode,
  updateNode,
  clearSelectedNode,
  saveWorkflow,
  loadWorkflow,
} = workflowSlice.actions;

// Exporting the reducer to be used in the store
export default workflowSlice.reducer;
