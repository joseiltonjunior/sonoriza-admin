import { Checkout } from '@/pages/Checkout'
import { Error } from '@/pages/Error'
import { Home } from '@/pages/Home'
import { SignIn } from '@/pages/SignIn'
import { createBrowserRouter } from 'react-router-dom'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
    errorElement: <Error />,
  },
  {
    path: '/home',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
    errorElement: <Error />,
  },
])
