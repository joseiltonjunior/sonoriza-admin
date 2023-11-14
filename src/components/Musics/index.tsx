import { MusicProps } from '@/types/musicProps'
import { useState } from 'react'
import { IoHeart, IoPlay } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

interface MusicListProps {
  musics: MusicProps[]
}

export function Musics({ musics }: MusicListProps) {
  const [musicsFiltered, setMusicFilteres] = useState<MusicProps[]>(musics)

  const handleFilterMusic = (filter: string) => {
    if (filter.length < 3) return setMusicFilteres(musics)
    const listFiltered = musics.filter((music) =>
      music.title.toLowerCase().includes(filter.toLowerCase()),
    )

    setMusicFilteres(listFiltered)
  }

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
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <IoHeart color={colors.red[600]} />
                  <p>{music.like ?? 0}</p>
                </div>

                <div className="flex items-center gap-1">
                  <IoPlay color={colors.blue[600]} />
                  <p>{music.view ?? 0}</p>
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
