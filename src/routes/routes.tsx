import { Checkout } from '@/pages/Checkout'
import { Error } from '@/pages/Error'
import { Home } from '@/pages/Home'
import { createBrowserRouter } from 'react-router-dom'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
])
