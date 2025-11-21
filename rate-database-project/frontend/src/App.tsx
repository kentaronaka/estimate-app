import React from "react";
import RateList from "./components/RateList";
import RateEditor from "./components/RateEditor";

function App() {
  return (
    <div>
      <h1>Rate Database Management</h1>
      <RateEditor />
      <RateList />
    </div>
  );
}

export default App;