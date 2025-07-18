import React from 'react';
import { createRoot } from 'react-dom/client';

function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Hello from React!</h1>
      <p>This is a minimal React app to test if React is working.</p>
      <button onClick={() => alert('React is working!')}>Click me</button>
    </div>
  );
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<MinimalApp />);