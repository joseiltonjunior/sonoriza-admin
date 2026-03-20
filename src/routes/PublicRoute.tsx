import { Navigate, Outlet } from 'react-router-dom'

import { useResolvedAuthStatus } from './useResolvedAuthStatus'

export function PublicRoute() {
  const authStatus = useResolvedAuthStatus()

  if (authStatus === 'checking') {
    return null
  }

  if (authStatus === 'authenticated') {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
