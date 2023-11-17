import { MusicResponseProps } from '@/types/musicProps'
import { useEffect, useState } from 'react'
import { IoHeart, IoPlay, IoTrash } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { FormMusic } from '../FormMusic'

import { useModal } from '@/hooks/useModal'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'

import {
  TrackListRemoteProps,
  handleTrackListRemote,
} from '@/storage/modules/trackListRemote/reducer'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useToast } from '@/hooks/useToast'
import { useFirebaseServices } from '@/hooks/useFirebaseServices'

export function Musics() {
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )

  const [musicsFiltered, setMusicFilteres] = useState<MusicResponseProps[]>()

  const dispatch = useDispatch()

  const { openModal, closeModal } = useModal()
  const { showToast } = useToast()
  const { getMusics, removeMusicFromArtists } = useFirebaseServices()

  const handleFilterMusic = (filter: string) => {
    if (filter.length < 3) return setMusicFilteres(trackListRemote)
    const listFiltered = trackListRemote.filter((music) =>
      music.title.toLowerCase().includes(filter.toLowerCase()),
    )

    setMusicFilteres(listFiltered)
  }

  const handleRemoveMusic = async (music: MusicResponseProps) => {
    const musicsCollection = 'musics'

    if (music.id) {
      const musicsDocRef = doc(firestore, musicsCollection, music.id)

      try {
        const musicsDoc = await getDoc(musicsDocRef)

        if (musicsDoc.exists()) {
          await deleteDoc(musicsDocRef)

          showToast('Music removed successfully', {
            type: 'success',
            theme: 'light',
          })

          closeModal()

          await removeMusicFromArtists(music)

          const responseMusics = await getMusics()
          dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))
        } else {
          showToast('Artist not found', {
            type: 'warning',
            theme: 'light',
          })
        }
      } catch (error) {
        showToast(`Error removing artist`, {
          type: 'error',
          theme: 'light',
        })
      }
    }
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
        <div
          key={music.id}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 grid grid-cols-[1fr,auto,30px] gap-12 border hover:border-gray-300 w-full items-center justify-between`}
        >
          <button
            className="flex items-center gap-4"
            title="Open music"
            onClick={() => {
              openModal({
                children: <FormMusic music={music} />,
              })
            }}
          >
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
          </button>

          <div className="items-end flex flex-col">
            {music.artists.map((artist) => (
              <p key={artist.id} className="font-semibold">
                {artist.name}
              </p>
            ))}
          </div>

          <button
            title="Remove"
            className="p-2 rounded-full"
            onClick={() => {
              openModal({
                textConfirm: 'Delete',
                description: 'Do you really want to delete the music?',
                title: 'Attention',

                confirm() {
                  handleRemoveMusic(music)
                },
              })
            }}
          >
            <IoTrash size={22} color={colors.red[600]} />
          </button>
        </div>
      ))}
    </div>
  )
}
