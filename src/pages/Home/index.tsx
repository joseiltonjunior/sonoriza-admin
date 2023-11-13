import { Layout } from '@/components/Layout'

import { useToast } from '@/hooks/useToast'

import { collection, getDocs, query } from 'firebase/firestore'
import { firestore, auth } from '@/services/firebase'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'
import { MusicProps } from '@/types/musicProps'

import { useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { SideMenuProps } from '@/storage/modules/sideMenu/reducer'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { ArtistsDataProps } from '@/types/artistsProps'
import { Button } from '@/components/Button'
import { FormMusic } from '@/components/FormMusic'
import { UserDataProps } from '@/types/userProps'

import { Users } from '@/components/Users'
import { Artists } from '@/components/Artists'
import { IoHeart } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

export function Home() {
  const { showToast } = useToast()

  const [musics, setMusics] = useState<MusicProps[]>()
  const [genres, setGenres] = useState<MusicalGenresDataProps[]>()
  const [artists, setArtists] = useState<ArtistsDataProps[]>()
  const [users, setUsers] = useState<UserDataProps[]>()

  const [currentForm, setCurrentForm] = useState<number>()

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const handleFormatTitle = useMemo(() => {
    switch (tag) {
      case 'artists':
        return `${artists?.length ?? 0} - Artists`

      case 'genres':
        return `${genres?.length ?? 0} - Musical Genres`

      case 'musics':
        return `${musics?.length ?? 0} - Musics`

      case 'users':
        return `${users?.length ?? 0} - Users`

      default:
        return ''
    }
  }, [artists?.length, genres?.length, musics?.length, tag, users?.length])

  const handleFetchMusics = useCallback(() => {
    const q = query(collection(firestore, 'musics'))
    getDocs(q)
      .then((querySnapshot) => {
        const musicsResponse = querySnapshot.docs.map((doc) => doc.data())

        setMusics(musicsResponse as MusicProps[])
      })
      .catch(() => {
        showToast('Error while fetching musics', {
          type: 'error',
          theme: 'colored',
        })
      })
  }, [showToast])

  const handleFetchArtists = useCallback(() => {
    const q = query(collection(firestore, 'artists'))
    getDocs(q)
      .then((querySnapshot) => {
        const artistsResponse = querySnapshot.docs.map((doc) => doc.data())

        setArtists(artistsResponse as ArtistsDataProps[])
      })
      .catch(() => {
        showToast('Error while fetching artists', {
          type: 'error',
          theme: 'colored',
        })
      })
  }, [showToast])

  const handleFetchUsers = useCallback(() => {
    const q = query(collection(firestore, 'users'))
    getDocs(q)
      .then((querySnapshot) => {
        const usersResponse = querySnapshot.docs.map((doc) => doc.data())

        setUsers(usersResponse as UserDataProps[])
      })
      .catch(() => {
        showToast('Error while fetching users', {
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
        handleFetchUsers()
      })
      .catch(() => {
        showToast('Error while fetching data', {
          type: 'error',
          theme: 'colored',
        })
      })
      .finally(() => setIsLoading(false))
  }, [handleFetchArtists, handleFetchMusics, handleFetchUsers, showToast])

  useEffect(() => {
    setCurrentForm(undefined)
  }, [tag])

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
        <div className="grid grid-cols-[1fr,80px] justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-700 leading-6">Home</h1>
            <h3 className="font-bold text-purple-600 leading-8 text-xl">
              {handleFormatTitle}
            </h3>
          </div>
          {currentForm !== undefined ? (
            <Button
              title="Cancel"
              variant="red"
              onClick={() => {
                setCurrentForm(undefined)
              }}
            />
          ) : (
            <Button
              title="Add"
              variant="purple"
              onClick={() => {
                if (tag === 'musics') {
                  setCurrentForm(0)
                }
              }}
            />
          )}
        </div>

        {tag === 'musics' &&
          currentForm !== 0 &&
          musics &&
          musics.map((music) => (
            <button
              onClick={() => {
                console.log(music)
              }}
              key={music.id}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex border hover:border-gray-300 w-full items-center justify-between`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-700 w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={music.artwork}
                    alt="artwork track music"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-purple-600 font-bold">{music.title}</p>
                  <div className="flex items-center gap-1">
                    <IoHeart color={colors.red[600]} />
                    <p>{music.like ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="items-end flex flex-col">
                {music.artists.map((artist) => (
                  <p key={artist.id}>{artist.name}</p>
                ))}
              </div>
            </button>
          ))}

        {tag === 'artists' && artists && <Artists artists={artists} />}

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
              <p className="font-bold text-gray-500">{genre.name}</p>
            </button>
          ))}

        {tag === 'users' && users && (
          <Users users={users} onSuccessfully={handleFetchUsers} />
        )}

        {currentForm === 0 && (
          <FormMusic musicalGenres={genres} artists={artists} />
        )}

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
