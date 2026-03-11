import { ArtistsResponseProps } from './artistsProps'

export interface MusicResponseProps {
  url: string
  title: string
  artists: ArtistsResponseProps[]
  genre: string
  genreId: string
  album: string
  artwork: string
  id: string
  color: string
  like: number
  view: number
  slug: string
}

export interface MusicFormDataProps {
  url: string
  title: string
  artistIds: string[]
  genreId: string
  album: string
  artwork: string
  id?: string
  color: string
  slug: string
}
