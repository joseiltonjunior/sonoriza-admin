import { store } from '@/storage'
import { handleSetAdmin } from '@/storage/modules/admin/reducer'
import { handleSetArtists } from '@/storage/modules/artists/reducer'
import { handleSetMusicalGenres } from '@/storage/modules/musicalGenres/reducer'
import { handleTrackListRemote } from '@/storage/modules/trackListRemote/reducer'
import { handleSetUsers } from '@/storage/modules/users/reducer'
import { EMPTY_PAGINATION_META } from '@/types/paginationProps'

export const ACCESS_TOKEN = '@SONORIZA_ACCESS_TOKEN'
export const REFRESH_TOKEN = '@SONORIZA_REFRESH_TOKEN'

interface SessionTokens {
  accessToken: string
  refreshToken: string
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN)
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN)
}

export function hasAccessToken() {
  return Boolean(getAccessToken())
}

export function hasRefreshToken() {
  return Boolean(getRefreshToken())
}

export function setSessionTokens({ accessToken, refreshToken }: SessionTokens) {
  window.localStorage.setItem(ACCESS_TOKEN, accessToken)
  window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
}

export function clearSessionTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN)
  window.localStorage.removeItem(REFRESH_TOKEN)
}

export function clearClientSession() {
  store.dispatch(handleSetArtists({ artists: [] }))
  store.dispatch(
    handleTrackListRemote({
      trackListRemote: [],
      ...EMPTY_PAGINATION_META,
    }),
  )
  store.dispatch(handleSetMusicalGenres({ musicalGenres: [] }))
  store.dispatch(handleSetUsers({ users: [] }))
  store.dispatch(
    handleSetAdmin({
      admin: { email: '', id: '', name: '', photoURL: '' },
    }),
  )

  clearSessionTokens()
}
