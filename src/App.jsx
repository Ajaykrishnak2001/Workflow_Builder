import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Canvas from "./components/canvas/Canvas";
import NodePalette from "./components/nodePalette/NodePalette";
import PropertiesPanel from "./components/propertiesPanel/PropertiesPanel";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="app-header">Workflow Builder</header>
        <div className="main-content">
          <NodePalette />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </Provider>
  );
};

export default App;
