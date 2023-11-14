import { auth } from '@/services/firebase'

import { useEffect, useState } from 'react'

import { Button } from './Button'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { ArtistsProps } from '@/storage/modules/artists/reducer'
import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { UsersProps } from '@/storage/modules/users/reducer'

interface AsideProps {
  isError?: boolean
}

export function Aside({ isError }: AsideProps) {
  const [isUser, setIsUser] = useState(false)

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setIsUser(true)
        return
      }
      setIsUser(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="bg-gray-700 w-[350px] h-screen fixed base:hidden">
      {!isError && isUser && (
        <>
          <div className="flex flex-col gap-4 px-10 pt-10">
            <Button
              currentTag="artists"
              title={`${artists.length} - Artists`}
            />
            <Button
              currentTag="genres"
              title={`${musicalGenres.length} - Musical Genres`}
            />
            <Button
              currentTag="musics"
              title={`${trackListRemote.length} - Musics`}
            />
            <Button currentTag="users" title={`${users.length} - Users`} />
          </div>
        </>
      )}
    </div>
  )
}
