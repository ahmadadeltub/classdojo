import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Initialize the app.
 * If running inside Office (PowerPoint), wait for Office.onReady().
 * If running standalone in a browser, render immediately.
 */
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// Check if Office.js is available (we're in PowerPoint)
if (typeof Office !== 'undefined' && Office.onReady) {
  Office.onReady(() => {
    console.log('✅ Office.js initialized — running inside PowerPoint');
    renderApp();
  });
} else {
  // Standalone mode — render immediately
  console.log('ℹ️ Running in standalone mode (no Office context)');
  renderApp();
}
