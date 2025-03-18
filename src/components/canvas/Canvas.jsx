import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addNode,
  addConnection,
  removeNode,
  selectNode,
  saveWorkflow,
  loadWorkflow,
} from "../../redux/workflowSlice";
import Swal from "sweetalert2";
import "./Canvas.css";

const Canvas = () => {
  const dispatch = useDispatch();
  const { project } = useReactFlow(); // ReactFlow instance to get project coordinates
  const reduxNodes = useSelector((state) => state.workflow.nodes); 
  const reduxEdges = useSelector((state) => state.workflow.edges); 

  //  Ensure initial empty arrays to avoid issues
  const [nodes, setNodes, onNodesChange] = useNodesState([]); 
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); 

  // Sync Redux nodes with local nodes state
  useEffect(() => {
    setNodes(reduxNodes);
  }, [reduxNodes, setNodes]);

  // Sync Redux edges with local edges state
  useEffect(() => {
    setEdges(reduxEdges);
  }, [reduxEdges, setEdges]);

  //  Handle connection between nodes
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds)); 
      dispatch(addConnection(params)); 
    },
    [setEdges, dispatch]
  );

  // Handle drag over event for dropping nodes
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Handle drop event to create new node
  const onDrop = (event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData("application/reactflow"); 
    if (!nodeType) return;

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    
    //  Convert event coordinates to ReactFlow coordinates
    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    });

    dispatch(addNode({ type: nodeType, position })); 
  };

  // Handle right-click context menu for node deletion
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the "${node.data.label}" node?`, 
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeNode(node.id)); 
        Swal.fire({
          title: "Deleted!",
          text: "Your node has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    });
  };

  //  Handle left-click event to select node
  const onNodeClick = (event, node) => {
    dispatch(selectNode(node.id)); 
  };

  // Save the current workflow
  const handleSaveWorkflow = () => {
    dispatch(saveWorkflow()); 
    Swal.fire({
      title: "Success!",
      text: "Workflow saved successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };

  //  Load a saved workflow
  const handleLoadWorkflow = () => {
    dispatch(loadWorkflow()); 
    Swal.fire({
      title: "Loaded!",
      text: "Workflow loaded successfully.",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };

  return (
    <div className="canvas-container" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect} 
        onNodeContextMenu={onNodeContextMenu} 
        onNodeClick={onNodeClick} 
        fitView
      >
        <Controls /> {/* ReactFlow Controls component for zooming/panning */}
        <MiniMap /> {/* ReactFlow MiniMap component */}
        <Background color="#aaa" gap={16} /> {/* Background grid for clarity */}
      </ReactFlow>

      <div className="canvas-buttons">
        {/* Buttons to save/load workflow */}
        <button className="save-workflow-button" onClick={handleSaveWorkflow}>
          Save Workflow
        </button>
        <button className="load-workflow-button" onClick={handleLoadWorkflow}>
          Load Workflow
        </button>
      </div>
    </div>
  );
};

export default Canvas;
