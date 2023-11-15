import { Button } from '@/components/Button'

import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'

import { MusicEditDataProps, MusicResponseProps } from '@/types/musicProps'

import { useEffect, useMemo, useState } from 'react'
import { Select } from '../form/Select'
import {
  ArtistsResponseProps,
  ArtistsEditDataProps,
} from '@/types/artistsProps'
import { useToast } from '@/hooks/useToast'
import { IoClose } from 'react-icons/io5'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useModal } from '@/hooks/useModal'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import {
  ArtistsProps,
  handleSetArtists,
} from '@/storage/modules/artists/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { useFirebaseServices } from '@/hooks/useFirebaseServices'
import { handleTrackListRemote } from '@/storage/modules/trackListRemote/reducer'

interface FormMusicProps {
  music?: MusicResponseProps
}

export function FormMusic({ music }: FormMusicProps) {
  const [selectedArtists, setSelectedArtists] = useState<
    ArtistsEditDataProps[]
  >([])

  const [isLoading, setIsLoading] = useState(false)

  const { register, setValue, handleSubmit } = useForm<MusicEditDataProps>()
  const { getMusics, getArtists } = useFirebaseServices()
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const handleUpdateMusic = async (data: MusicEditDataProps) => {
    const musicsCollection = 'musics'
    const artistsCollection = 'artists'
    setIsLoading(true)

    if (data.id) {
      const musicsDocRef = doc(firestore, musicsCollection, data.id)

      try {
        const musicsDoc = await getDoc(musicsDocRef)

        if (musicsDoc.exists()) {
          await updateDoc(musicsDocRef, { ...data })

          await Promise.all(
            data.artists.map(async (artist) => {
              const artistDocRef = doc(firestore, artistsCollection, artist.id)
              const artistDoc = await getDoc(artistDocRef)

              if (artistDoc.exists()) {
                const artistData = artistDoc.data() as ArtistsResponseProps
                const updatedMusics = [...artistData.musics]
                if (!artistData.musics.includes(String(data.id))) {
                  updatedMusics.push(String(data.id))
                }

                await updateDoc(artistDocRef, { musics: updatedMusics })

                const responseArtists = await getArtists()
                dispatch(handleSetArtists({ artists: responseArtists }))
              }
            }),
          )

          showToast('Music updated successfully', {
            type: 'success',
            theme: 'light',
          })

          const responseMusics = await getMusics()
          dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))
        } else {
          showToast('Music not found', {
            type: 'warning',
            theme: 'light',
          })
        }
        setIsLoading(false)
        closeModal()
      } catch (error) {
        setIsLoading(false)
        showToast(`Error updating music`, {
          type: 'error',
          theme: 'light',
        })
      }
    }
  }

  const handleSaveMusic = async (data: MusicEditDataProps) => {
    const musicsCollection = 'musics'
    const artistsCollection = 'artists'
    setIsLoading(true)

    try {
      const { id } = await addDoc(collection(firestore, musicsCollection), {
        ...data,
      })

      const musicsDocRef = doc(firestore, musicsCollection, id)
      await updateDoc(musicsDocRef, { id })

      await Promise.all(
        data.artists.map(async (artist) => {
          const artistDocRef = doc(firestore, artistsCollection, artist.id)
          const artistDoc = await getDoc(artistDocRef)

          if (artistDoc.exists()) {
            const artistData = artistDoc.data()
            const updatedMusics = [...(artistData.musics || []), data.id]

            await updateDoc(artistDocRef, { musics: updatedMusics })

            const responseArtists = await getArtists()
            dispatch(handleSetArtists({ artists: responseArtists }))
          }
        }),
      )

      showToast('Music added successfully', {
        type: 'success',
        theme: 'light',
      })

      const responseMusics = await getMusics()
      dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))

      setIsLoading(false)
      closeModal()
    } catch (error) {
      setIsLoading(false)
      showToast(`Error adding music`, {
        type: 'error',
        theme: 'light',
      })
    }
  }

  function submit(data: MusicEditDataProps) {
    if (selectedArtists.length < 1) {
      showToast('Select at least one artist', {
        type: 'error',
        theme: 'colored',
      })

      return
    }

    if (!data.genre) {
      showToast('Select at least one musical genre', {
        type: 'error',
        theme: 'colored',
      })

      return
    }

    const newMusic = {
      ...data,
      artists: selectedArtists,
    }

    if (data.id) {
      handleUpdateMusic(newMusic)
      return
    }
    handleSaveMusic(newMusic)
  }

  const musicalGenresOtions = useMemo(() => {
    const options = musicalGenres?.map((genre) => {
      return {
        label: genre.name,
        value: genre.name,
      }
    })

    if (!options) return

    return [{ label: 'Select', value: '' }, ...options]
  }, [musicalGenres])

  const artistsOptions = useMemo(() => {
    const options = artists?.map((artist) => {
      return {
        label: artist.name,
        value: artist.id,
      }
    })

    if (!options) return

    return [{ label: 'Select one or more', value: '' }, ...options]
  }, [artists])

  const handleSelectedArtists = (artistId: string) => {
    const { id, name, photoURL } = artists?.find(
      (artist) => artist.id === artistId,
    ) as ArtistsResponseProps

    const isArtistsExists = selectedArtists.find((item) => item.id === artistId)
    if (isArtistsExists) return

    setSelectedArtists([...selectedArtists, { id, name, photoURL }])
    setValue('artists', [])
  }

  const handleRemoveArtists = (artist: ArtistsEditDataProps) => {
    const filter = selectedArtists.filter((item) => item.id !== artist.id)
    setSelectedArtists(filter)
  }

  useEffect(() => {
    if (music) {
      setValue('album', music.album)
      setValue('artwork', music.artwork)
      setValue('color', music.color)
      setValue('title', music.title)
      setValue('title', music.title)
      setValue('url', music.url)
      setValue('genre', music.genre)
      setValue('id', music.id)

      setSelectedArtists(music.artists)
    }
  }, [music, setValue])

  return (
    <>
      <h1 className="font-bold text-xl text-purple-600">
        {music ? 'Edit' : 'Add new'} music
      </h1>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      {selectedArtists.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Selected artists</p>
          <div className="flex gap-2">
            {selectedArtists.map((artist) => (
              <div key={artist.id} className="flex">
                <div className="w-20 h-20 rounded-full bg-gray-700 items-center justify-center overflow-hidden">
                  <img
                    src={artist.photoURL}
                    alt="photo artists"
                    title={artist.name}
                    className="object-cover"
                  />
                </div>
                <button
                  className="w-6 h-6 rounded-full bg-purple-700 items-center justify-center flex -ml-5 -mt-1 hover:bg-purple-500"
                  title="Remove"
                  onClick={() => handleRemoveArtists(artist)}
                >
                  <IoClose color={'#fff'} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Music Title"
              label="Title"
              name="title"
              register={register}
              required
            />
            <Input
              placeholder="Album Music"
              label="Album"
              name="album"
              register={register}
              required
            />
            <Select
              options={artistsOptions}
              label="Artists"
              name="artists"
              register={register}
              onChange={(e) => handleSelectedArtists(e.currentTarget.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="www.sonoriza.com"
              label="Artwork URL"
              name="artwork"
              register={register}
              required
            />
            <Input
              placeholder="www.sonoriza.com"
              label="Music URL"
              name="url"
              register={register}
              required
            />
          </div>

          <div className="grid grid-cols-[250px,120px] gap-4">
            <Select
              options={musicalGenresOtions}
              label="Musical Genrer"
              name="genre"
              register={register}
              required
            />
            <Input
              placeholder="#ffffff"
              label="Color"
              name="color"
              register={register}
              required
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7" />

        <Button
          title="Save"
          className="max-w-[140px] ml-auto"
          variant="purple"
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
