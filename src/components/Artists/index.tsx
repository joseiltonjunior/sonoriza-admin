import { useFirebaseServices } from '@/hooks/useFirebaseServices'
import { useToast } from '@/hooks/useToast'
import { firestore } from '@/services/firebase'
import { ReduxProps } from '@/storage'
import {
  ArtistsProps,
  handleSetArtists,
} from '@/storage/modules/artists/reducer'
import { ArtistsResponseProps } from '@/types/artistsProps'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import {
  IoHeart,
  IoMusicalNoteSharp,
  IoPerson,
  IoPlay,
  IoTrash,
} from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'
import { FormArtist } from '../FormArtist'
import { useModal } from '@/hooks/useModal'

export function Artists() {
  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const [artistsFiltered, setArtistsFiltered] = useState<
    ArtistsResponseProps[]
  >([])

  const dispatch = useDispatch()

  const { openModal, closeModal } = useModal()

  const { showToast } = useToast()

  const { getArtists } = useFirebaseServices()

  const handleFilterArtists = (filter: string) => {
    if (filter.length < 3) return setArtistsFiltered(artists)
    const listFiltered = artists.filter((artist) =>
      artist.name.toLowerCase().includes(filter.toLowerCase()),
    )

    setArtistsFiltered(listFiltered)
  }
  const handleRemoveArtist = async (artistId: string) => {
    const artistsCollection = 'artists'

    if (artistId) {
      const artistsDocRef = doc(firestore, artistsCollection, artistId)

      try {
        const artistsDoc = await getDoc(artistsDocRef)

        if (artistsDoc.exists()) {
          await deleteDoc(artistsDocRef)

          showToast('Artist removed successfully', {
            type: 'success',
            theme: 'light',
          })

          closeModal()

          const responseArtists = await getArtists()
          dispatch(handleSetArtists({ artists: responseArtists }))
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
    if (artists) {
      setArtistsFiltered(artists)
    }
  }, [artists])

  return (
    <>
      <div className="h-[1px] bg-gray-300/50 my-7" />
      <div className="mt-8">
        <h4 className="font-bold text-sm my-3">Search by artist</h4>
        <input
          placeholder="Type a artist"
          type="text"
          onChange={(e) => handleFilterArtists(e.currentTarget.value)}
          className={
            'w-72 bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600'
          }
        />
      </div>
      {artistsFiltered.map((artist) => (
        <div
          key={artist.id}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
        >
          <button
            className="flex items-center gap-4 w-full"
            onClick={() => {
              openModal({
                children: <FormArtist artist={artist} />,
              })
            }}
          >
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

            <div className="flex flex-col items-start">
              <p className="text-purple-600 font-bold text-lg">{artist.name}</p>
              <p>ID: {artist.id}</p>
            </div>
          </button>

          <div className="flex gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              title="Musics"
            >
              <IoMusicalNoteSharp size={18} color={colors.purple[600]} />
              <p className="font-semibold">
                {(artist.musics && artist.musics.length) ?? 0}
              </p>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              title="Likes"
            >
              <IoHeart size={18} color={colors.red[600]} />
              <p className="font-semibold"> {artist.like ?? 0}</p>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              title="Streams"
            >
              <IoPlay size={18} color={colors.blue[600]} />
              <p className="font-semibold">0</p>
            </div>
          </div>
          <button
            title="Remove"
            className="p-2 rounded-full"
            onClick={() => {
              openModal({
                textConfirm: 'Delete',
                description: 'Do you really want to delete the artist?',
                title: 'Attention',

                confirm() {
                  handleRemoveArtist(artist.id)
                },
              })
            }}
          >
            <IoTrash size={22} color={colors.red[600]} />
          </button>
        </div>
      ))}
    </>
  )
}
