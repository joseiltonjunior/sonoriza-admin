import React from 'react'
import ReactDOM from 'react-dom/client'

import { Hooks } from './hooks/index.tsx'
import './i18n'
import './index.css'

import { RouterProvider } from 'react-router-dom'

import { routes } from './routes/routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Hooks>
      <RouterProvider router={routes} />
    </Hooks>
  </React.StrictMode>,
)
