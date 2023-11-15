import { ArtistsResponseProps, ArtistsEditDataProps } from './artistsProps'

export interface MusicResponseProps {
  url: string
  title: string
  artists: ArtistsResponseProps[]
  genre: string
  album: string
  artwork: string
  id: string
  color: string
  like: number
  view: number
}

export interface MusicEditDataProps {
  url: string
  title: string
  artists: ArtistsEditDataProps[]
  genre: string
  album: string
  artwork: string
  id?: string
  color: string
}
