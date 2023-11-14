import { ReduxProps } from '@/storage'
import { ArtistsProps } from '@/storage/modules/artists/reducer'

import { IoHeart, IoMusicalNoteSharp, IoPerson, IoPlay } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function Artists() {
  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  return (
    <>
      {artists.map((artist) => (
        <button
          onClick={() => {
            console.log(artist)
          }}
          key={artist.id}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 w-16 h-16 rounded-full overflow-hidden">
              {artist.photoURL ? (
                <img
                  src={artist.photoURL}
                  alt="artist photo profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center">
                  <IoPerson size={30} color={colors.white} />
                </div>
              )}
            </div>
            <p className="text-purple-600 font-bold text-lg">{artist.name}</p>
          </div>
          <div>
            <div className="flex items-center gap-2" title="Musics">
              <IoMusicalNoteSharp size={18} color={colors.purple[600]} />
              <p className="font-semibold"> {artist.musics.length}</p>
            </div>
            <div className="flex items-center gap-2" title="Likes">
              <IoHeart size={18} color={colors.red[600]} />
              <p className="font-semibold"> {artist.like ?? 0}</p>
            </div>
            <div className="flex items-center gap-2" title="Streams">
              <IoPlay size={18} color={colors.blue[600]} />
              <p className="font-semibold">0</p>
            </div>
          </div>
        </button>
      ))}
    </>
  )
}
