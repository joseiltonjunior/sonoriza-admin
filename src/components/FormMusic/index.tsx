import { Button } from '@/components/Button'

import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'

import { MusicProps } from '@/types/musicProps'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { useMemo, useState } from 'react'
import { Select } from '../form/Select'
import { ArtistsDataProps } from '@/types/artistsProps'
import { useToast } from '@/hooks/useToast'

interface FormMusicProps {
  musicalGenres?: MusicalGenresDataProps[]
  artists?: ArtistsDataProps[]
}

interface ArtistsInMusicProps {
  id: string
  photoURL: string
  name: string
}

export function FormMusic({ musicalGenres, artists }: FormMusicProps) {
  const [selectedArtists, setSelectedArtists] = useState<ArtistsInMusicProps[]>(
    [],
  )

  const {
    register,

    handleSubmit,
  } = useForm<MusicProps>()

  const { showToast } = useToast()

  function submit(data: MusicProps) {
    if (!selectedArtists) {
      showToast('Select at least one artist', {
        type: 'error',
        theme: 'colored',
      })
    }

    if (!data.genre) {
      showToast('Select at least one musical genre', {
        type: 'error',
        theme: 'colored',
      })
    }

    const newMusic = {
      ...data,
      artists: selectedArtists,
    }
    console.log(newMusic)
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

    return [{ label: 'Select', value: '' }, ...options]
  }, [artists])

  const handleSelectedArtists = (artistId: string) => {
    const { id, name, photoURL } = artists?.find(
      (artist) => artist.id === artistId,
    ) as ArtistsDataProps

    setSelectedArtists([...selectedArtists, { id, name, photoURL }])
  }

  return (
    <>
      <div className="h-[1px] bg-gray-300/50 my-7" />
      <form
        onSubmit={handleSubmit(submit)}
        className="relative max-w-[598px] md:max-w-full"
      >
        <div className="max-w-[410px] md:max-w-full">
          <Input
            placeholder="Music Title"
            label="Title"
            name="title"
            register={register}
            required
          />
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

          <div className="grid md:grid-cols-1 grid-cols-[180px,1fr] gap-4">
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

          <div className="grid md:grid-cols-1 grid-cols-[149px,1fr] gap-4">
            <Input
              placeholder="#ffffff"
              label="Color"
              name="color"
              register={register}
              required
            />

            <Select
              options={musicalGenresOtions}
              label="Musical Genrer"
              name="genre"
              register={register}
              required
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />

        <Button title="Save" className="max-w-[140px]" variant="outline" />
      </form>
    </>
  )
}
