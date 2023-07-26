import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Hooks } from './hooks/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Hooks>
      <App />
    </Hooks>
  </React.StrictMode>,
)
