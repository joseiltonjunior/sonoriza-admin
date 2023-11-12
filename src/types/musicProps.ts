import { ArtistsDataProps } from './artistsProps'

export interface MusicProps {
  url: string
  title: string
  artists: ArtistsDataProps[]
  genre: string
  album: string
  date: string
  artwork: string
  duration: number
  id: string
  color: string
  isFavorite: boolean
  like: number
}
