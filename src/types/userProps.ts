export interface FormDataProps {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserDataProps {
  email: string | null
  displayName: string | null
  photoUrl: string | null
  id: string
  accountStatus: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED'
  favoritesArtists?: string[]
  favoritesMusics?: string[]
  tokenFcm: string
}
