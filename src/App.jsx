import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}

export default App;