import React from 'react'
import ReactDOM from 'react-dom/client'

import { Hooks } from './hooks/index.tsx'
import './i18n'
import './index.css'

import { BrowserRouter } from 'react-router-dom'

import { App } from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Hooks>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Hooks>
  </React.StrictMode>,
)
