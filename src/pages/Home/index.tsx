import { Layout } from '@/components/Layout'

import { useToast } from '@/hooks/useToast'

import { useEffect, useMemo, useState } from 'react'

import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { SideMenuProps } from '@/storage/modules/sideMenu/reducer'

import { Button } from '@/components/Button'
import { FormMusic } from '@/components/FormMusic'

import { Users } from '@/components/Users'
import { Artists } from '@/components/Artists'

import { Musics } from '@/components/Musics'
import { getAuth } from 'firebase/auth'
import { IoMusicalNoteSharp } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { useModal } from '@/hooks/useModal'
import {
  TrackListRemoteProps,
  handleTrackListRemote,
} from '@/storage/modules/trackListRemote/reducer'
import {
  ArtistsProps,
  handleSetArtists,
} from '@/storage/modules/artists/reducer'
import {
  MusicalGenresProps,
  handleSetMusicalGenres,
} from '@/storage/modules/musicalGenres/reducer'
import { useFirebaseServices } from '@/hooks/useFirebaseServices'
import { UsersProps, handleSetUsers } from '@/storage/modules/users/reducer'

export function Home() {
  const { showToast } = useToast()
  const { openModal } = useModal()
  const { getArtists, getGenres, getMusics, getUsers } = useFirebaseServices()

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )
  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const auth = getAuth()
  const dispatch = useDispatch()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const handleFormatTitle = useMemo(() => {
    switch (tag) {
      case 'artists':
        return `Artists`

      case 'genres':
        return `Musical Genres`

      case 'musics':
        return `Musics`

      case 'users':
        return `Users`

      default:
        return ''
    }
  }, [tag])

  const handleGetMusicByGenre = (genre: string) => {
    const total = trackListRemote?.filter((item) => item.genre.includes(genre))

    return total?.length
  }

  const handleFetchData = async () => {
    try {
      setIsLoading(true)

      const musicsResponse = await getMusics()
      const artistsResponse = await getArtists()
      const musicalGenresResponse = await getGenres()
      const usersResponse = await getUsers()

      dispatch(handleSetArtists({ artists: artistsResponse }))
      dispatch(handleTrackListRemote({ trackListRemote: musicsResponse }))
      dispatch(handleSetMusicalGenres({ musicalGenres: musicalGenresResponse }))
      dispatch(handleSetUsers({ users: usersResponse }))

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      showToast('Error fetching data', {
        type: 'error',
        theme: 'colored',
      })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleFetchData()
      } else {
        navigate('/')
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

          {tag !== 'users' && (
            <>
              <Button
                title="Add"
                variant="purple"
                onClick={() => {
                  openModal({
                    children: <FormMusic />,
                  })
                }}
              />
            </>
          )}
        </div>

        {tag === 'musics' && trackListRemote && <Musics />}

        {tag === 'artists' && artists && <Artists />}

        {tag === 'genres' &&
          musicalGenres &&
          musicalGenres.map((genre) => (
            <button
              onClick={() => {
                console.log(genre)
              }}
              key={genre.name}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
            >
              <p className="font-semibold text-gray-500">{genre.name}</p>
              <div className="flex items-center gap-2" title="Musics">
                <IoMusicalNoteSharp size={18} color={colors.purple[600]} />
                <p className="font-semibold">
                  {handleGetMusicByGenre(genre.name)}
                </p>
              </div>
            </button>
          ))}

        {tag === 'users' && users && <Users />}

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
