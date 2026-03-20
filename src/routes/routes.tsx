import { App } from '@/App'

import { Error } from '@/pages/Error'
import { Home } from '@/pages/Home'
import { SignIn } from '@/pages/SignIn'
import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true,
            element: <SignIn />,
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: 'home',
            element: <Home />,
          },
        ],
      },
    ],
  },
])
