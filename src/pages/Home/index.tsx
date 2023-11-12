import { Layout } from '@/components/Layout'

import { useToast } from '@/hooks/useToast'

import { collection, getDocs, query } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { useCallback, useEffect, useState } from 'react'

import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import { MusicProps } from '@/types/musicProps'

import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { SideMenuProps, handleSetTag } from '@/storage/modules/sideMenu/reducer'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { ArtistsDataProps } from '@/types/artistsProps'

export function Home() {
  const { showToast } = useToast()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const [musics, setMusics] = useState<MusicProps[]>()
  const [genres, setGenres] = useState<MusicalGenresDataProps[]>()
  const [artists, setArtists] = useState<ArtistsDataProps[]>()

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleFetchMusics = useCallback(() => {
    const q = query(collection(firestore, 'musics'))
    getDocs(q)
      .then((querySnapshot) => {
        const musicsResponses = querySnapshot.docs.map((doc) => doc.data())

        setMusics(musicsResponses as MusicProps[])
      })
      .catch(() => {
        showToast('Error while fetching sales', {
          type: 'error',
          theme: 'colored',
        })
      })
  }, [showToast])

  const handleFetchArtists = useCallback(() => {
    const q = query(collection(firestore, 'artists'))
    getDocs(q)
      .then((querySnapshot) => {
        const artistsResponses = querySnapshot.docs.map((doc) => doc.data())

        setArtists(artistsResponses as ArtistsDataProps[])
      })
      .catch(() => {
        showToast('Error while fetching sales', {
          type: 'error',
          theme: 'colored',
        })
      })
  }, [showToast])

  const handleFetchGenres = useCallback(() => {
    setIsLoading(true)
    const q = query(collection(firestore, 'musicalGenres'))
    getDocs(q)
      .then((querySnapshot) => {
        const genresResponses = querySnapshot.docs.map((doc) => doc.data())

        setGenres(genresResponses as MusicalGenresDataProps[])

        handleFetchMusics()
        handleFetchArtists()
      })
      .catch(() => {
        showToast('Error while fetching sales', {
          type: 'error',
          theme: 'colored',
        })
      })
      .finally(() => setIsLoading(false))
  }, [handleFetchArtists, handleFetchMusics, showToast])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleFetchGenres()
      } else {
        navigate('/')
      }
    })

    return () => unsubscribe()
  }, [handleFetchArtists, handleFetchGenres, handleFetchMusics, navigate])

  return (
    <Layout>
      <div className="max-w-3xl pb-8">
        <h1 className="font-bold text-gray-700 leading-6">Sonoriza</h1>

        <h3 className="font-bold text-purple-600 leading-8 text-xl">Home</h3>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => dispatch(handleSetTag({ tag: 'musics' }))}
            className={`w-full  font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
              tag === 'musics'
                ? 'bg-white text-purple-600'
                : 'bg-purple-600 text-white'
            }`}
          >
            Músicas
          </button>
          <button
            onClick={() => dispatch(handleSetTag({ tag: 'artists' }))}
            className={`w-full  font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
              tag === 'artists'
                ? 'bg-white text-purple-600'
                : 'bg-purple-600 text-white'
            }`}
          >
            Artistas
          </button>
          <button
            onClick={() => dispatch(handleSetTag({ tag: 'genres' }))}
            className={`w-full  font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
              tag === 'genres'
                ? 'bg-white text-purple-600'
                : 'bg-purple-600 text-white'
            }`}
          >
            Gêneros
          </button>
        </div>

        {tag === 'musics' &&
          musics &&
          musics.map((music) => (
            <button
              onClick={() => {
                console.log(music)
              }}
              key={music.id}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
            >
              <p>{music.title}</p>
            </button>
          ))}

        {tag === 'artists' &&
          artists &&
          artists.map((artist) => (
            <button
              onClick={() => {
                console.log(artist)
              }}
              key={artist.id}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
            >
              <p>{artist.name}</p>
            </button>
          ))}

        {tag === 'genres' &&
          genres &&
          genres.map((genre) => (
            <button
              onClick={() => {
                console.log(genre)
              }}
              key={genre.name}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
            >
              <p>{genre.name}</p>
            </button>
          ))}

        {isLoading && (
          <>
            <Skeleton className="h-[80px] mt-8 rounded-2xl" />
            <Skeleton className="h-[80px] mt-8 rounded-2xl" />
          </>
        )}
      </div>
    </Layout>
  )
}
