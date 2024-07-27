import React from "react";
import "./App.css";
import Canvas from "./components/Canvas";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Canvas Drawing</h1>
      <Canvas />
    </div>
  );
};

export default App;
