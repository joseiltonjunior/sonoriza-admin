import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'

import './i18n'
import './index.css'

import { router } from './routes/routes.tsx'
import { Hooks } from './hooks/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Hooks>
      <RouterProvider router={router} />
    </Hooks>
  </React.StrictMode>,
)
