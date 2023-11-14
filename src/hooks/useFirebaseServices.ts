import { firestore } from '@/services/firebase'
import { MusicResponseProps } from '@/types/musicProps'
import { collection, getDocs, query } from 'firebase/firestore'
import { useCallback } from 'react'

import { ArtistsResponseProps } from '@/types/artistsProps'

import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { UserDataProps } from '@/types/userProps'

export function useFirebaseServices() {
  const getMusics = async () => {
    let musicsResponse = [] as MusicResponseProps[]
    const q = query(collection(firestore, 'musics'))
    await getDocs(q).then((querySnapshot) => {
      const response = querySnapshot.docs.map((doc) =>
        doc.data(),
      ) as MusicResponseProps[]

      musicsResponse = response
    })

    return musicsResponse
  }

  const getArtists = useCallback(async () => {
    let artistsResponse = [] as ArtistsResponseProps[]
    const q = query(collection(firestore, 'artists'))
    await getDocs(q).then((querySnapshot) => {
      const response = querySnapshot.docs.map((doc) =>
        doc.data(),
      ) as ArtistsResponseProps[]

      artistsResponse = response
    })

    return artistsResponse
  }, [])

  const getUsers = async () => {
    let users = [] as UserDataProps[]
    const q = query(collection(firestore, 'users'))
    await getDocs(q).then((querySnapshot) => {
      const response = querySnapshot.docs.map((doc) =>
        doc.data(),
      ) as UserDataProps[]

      users = response
    })

    return users
  }

  const getGenres = async () => {
    let musicalGenresResponse = [] as MusicalGenresDataProps[]
    const q = query(collection(firestore, 'musicalGenres'))
    await getDocs(q).then((querySnapshot) => {
      const response = querySnapshot.docs.map((doc) =>
        doc.data(),
      ) as MusicalGenresDataProps[]

      musicalGenresResponse = response
    })

    return musicalGenresResponse
  }

  return { getArtists, getGenres, getMusics, getUsers }
}
