import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

import {
  clearClientSession,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from './authStorage'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
})

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
})

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshSessionResponse {
  access_token: string
  refresh_token: string
}

let refreshPromise: Promise<string | null> | null = null

function redirectToSignIn() {
  if (window.location.pathname !== '/') {
    window.location.href = '/'
  }
}

function isSessionAuthRequest(url?: string) {
  if (!url) {
    return false
  }

  return (
    url.includes('/sessions') ||
    url.includes('/sessions/refresh') ||
    url.includes('/sessions/logout')
  )
}

async function requestSessionRefresh() {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    clearClientSession()
    return null
  }

  try {
    const response = await authClient.post<RefreshSessionResponse>(
      '/sessions/refresh',
      {
        refresh_token: refreshToken,
      },
    )

    setSessionTokens({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    })

    return response.data.access_token
  } catch {
    clearClientSession()
    return null
  }
}

export function refreshSessionTokens() {
  if (!refreshPromise) {
    refreshPromise = requestSessionRefresh().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function logoutCurrentSession(refreshToken: string) {
  await authClient.post('/sessions/logout', {
    refresh_token: refreshToken,
  })
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (originalRequest._retry || isSessionAuthRequest(originalRequest.url)) {
      clearClientSession()
      redirectToSignIn()
      return Promise.reject(error)
    }

    const refreshedAccessToken = await refreshSessionTokens()

    if (!refreshedAccessToken) {
      redirectToSignIn()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    originalRequest.headers = AxiosHeaders.from(originalRequest.headers)
    originalRequest.headers.set(
      'Authorization',
      `Bearer ${refreshedAccessToken}`,
    )

    return api(originalRequest)
  },
)
