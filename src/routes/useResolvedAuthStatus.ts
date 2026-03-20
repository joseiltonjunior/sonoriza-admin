import { useEffect, useState } from 'react'

import {
  clearClientSession,
  hasAccessToken,
  hasRefreshToken,
} from '@/services/authStorage'
import { refreshSessionTokens } from '@/services/api'

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

function getInitialAuthStatus(): AuthStatus {
  if (hasAccessToken()) {
    return 'authenticated'
  }

  if (hasRefreshToken()) {
    return 'checking'
  }

  return 'unauthenticated'
}

export function useResolvedAuthStatus() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(getInitialAuthStatus)

  useEffect(() => {
    if (authStatus !== 'checking') {
      return
    }

    let ignore = false

    refreshSessionTokens()
      .then((accessToken) => {
        if (ignore) {
          return
        }

        if (accessToken) {
          setAuthStatus('authenticated')
          return
        }

        clearClientSession()
        setAuthStatus('unauthenticated')
      })
      .catch(() => {
        if (ignore) {
          return
        }

        clearClientSession()
        setAuthStatus('unauthenticated')
      })

    return () => {
      ignore = true
    }
  }, [authStatus])

  return authStatus
}
