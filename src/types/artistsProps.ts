import { MusicalGenresDataProps } from './musicalGenresProps'

export interface ArtistsResponseProps {
  id: string
  title: string
  photoURL: string
  musics: string[]
  like: number
  musicalGenres: MusicalGenresDataProps[]
}

export interface ArtistsEditDataProps {
  id: string
  photoURL: string
  title: string
  musicalGenres: string
}
