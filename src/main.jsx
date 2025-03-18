import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ReactFlowProvider } from "reactflow";  // ✅ Import ReactFlowProvider
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ReactFlowProvider>  {/* ✅ Wrap with ReactFlowProvider */}
      <App />
    </ReactFlowProvider>
  </Provider>
);
