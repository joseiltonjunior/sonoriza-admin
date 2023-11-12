export interface FormDataProps {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserDataProps {
  email: string | null
  displayName: string | null
  photoURL: string | null
  uid: string
  plain: string | null
  favoritesArtists?: string[]
  favoritesMusics?: string[]
}
