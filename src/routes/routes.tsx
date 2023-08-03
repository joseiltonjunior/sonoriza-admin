import { App } from '@/App'
import { Checkout } from '@/pages/Checkout'
import { Error } from '@/pages/Error'
import { Home } from '@/pages/Home'
import { SignIn } from '@/pages/SignIn'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <SignIn />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
    ],
  },
])
