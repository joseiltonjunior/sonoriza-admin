import { MusicalGenresDataProps } from './musicalGenresProps'

export interface ArtistsResponseProps {
  id: string
  name: string
  photoURL: string
  musics: string[]
  like: number
  musicalGenres: MusicalGenresDataProps[]
}

export interface ArtistsEditDataProps {
  id: string
  photoURL: string
  name: string
  musicalGenres: MusicalGenresDataProps[]
}
