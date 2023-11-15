import { Button } from './Button'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { ArtistsProps } from '@/storage/modules/artists/reducer'
import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { UsersProps } from '@/storage/modules/users/reducer'
import { AdminProps } from '@/storage/modules/admin/reducer'

interface AsideProps {
  isError?: boolean
}

export function Aside({ isError }: AsideProps) {
  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )
  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )
  const { admin } = useSelector<ReduxProps, AdminProps>((state) => state.admin)

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  return (
    <div className="bg-gray-700 w-[350px] h-screen fixed base:hidden">
      {!isError && admin.uid && (
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
