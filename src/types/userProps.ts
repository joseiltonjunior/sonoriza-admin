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
  isActive: boolean
  favoritesArtists?: string[]
  favoritesMusics?: string[]
  tokenFcm: string
}
