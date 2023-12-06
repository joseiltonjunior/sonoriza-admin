import { ReduxProps } from '@/storage'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'
import { IoMusicalNoteSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'
import { FormMusicalGenres } from '../FormMusicalGenres'
import { useModal } from '@/hooks/useModal'

export function MusicalGenres() {
  const { openModal } = useModal()

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const handleGetMusicByGenre = (genre: string) => {
    const total = trackListRemote?.filter((item) => item.genre.includes(genre))

    return total?.length
  }

  return (
    <div>
      {musicalGenres.map((genre) => (
        <button
          key={genre.name}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
          onClick={() => {
            openModal({
              children: <FormMusicalGenres isExist={genre} />,
            })
          }}
        >
          <p className="font-semibold text-gray-500">{genre.name}</p>
          <div
            className="flex items-center gap-2 cursor-pointer"
            title="Musics"
          >
            <IoMusicalNoteSharp size={18} color={colors.purple[600]} />
            <p className="font-semibold">{handleGetMusicByGenre(genre.name)}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
