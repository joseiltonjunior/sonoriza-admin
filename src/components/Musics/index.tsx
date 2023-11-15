import { MusicResponseProps } from '@/types/musicProps'
import { useEffect, useState } from 'react'
import { IoHeart, IoPlay } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { FormMusic } from '../FormMusic'

import { useModal } from '@/hooks/useModal'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'

import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'

export function Musics() {
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const [musicsFiltered, setMusicFilteres] = useState<MusicResponseProps[]>()

  const { openModal } = useModal()

  const handleFilterMusic = (filter: string) => {
    if (filter.length < 3) return setMusicFilteres(trackListRemote)
    const listFiltered = trackListRemote.filter((music) =>
      music.title.toLowerCase().includes(filter.toLowerCase()),
    )

    setMusicFilteres(listFiltered)
  }

  useEffect(() => {
    if (trackListRemote) {
      setMusicFilteres(trackListRemote)
    }
  }, [trackListRemote])

  return (
    <div>
      <div className="h-[1px] bg-gray-300/50 my-7" />
      <div className="mt-8">
        <h4 className="font-bold text-sm my-3">Search by title</h4>
        <input
          placeholder="Type a Song"
          type="text"
          onChange={(e) => handleFilterMusic(e.currentTarget.value)}
          className={
            'w-72 bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600'
          }
        />
      </div>

      {musicsFiltered?.map((music) => (
        <button
          onClick={() => {
            openModal({
              children: <FormMusic music={music} />,
            })
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
            <div className="flex flex-col items-start">
              <p className="text-purple-600 font-bold">{music.title}</p>
              <p>ID: {music.id}</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1" title="Likes">
                  <IoHeart color={colors.red[600]} />
                  <p className="font-semibold">{music.like ?? 0}</p>
                </div>

                <div className="flex items-center gap-1" title="Streams">
                  <IoPlay color={colors.blue[600]} />
                  <p className="font-semibold">{music.view ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="items-end flex flex-col">
            {music.artists.map((artist) => (
              <p key={artist.id} className="font-semibold">
                {artist.name}
              </p>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}
