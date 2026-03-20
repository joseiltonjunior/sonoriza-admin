import { Navigate, Outlet } from 'react-router-dom'

import { useResolvedAuthStatus } from './useResolvedAuthStatus'

export function PrivateRoute() {
  const authStatus = useResolvedAuthStatus()

  if (authStatus === 'checking') {
    return null
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
