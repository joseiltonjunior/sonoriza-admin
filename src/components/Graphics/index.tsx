import { ReduxProps } from '@/storage'
import { ArtistsProps } from '@/storage/modules/artists/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'
import { UsersProps } from '@/storage/modules/users/reducer'
import ApexCharts from 'react-apexcharts'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

export function Graphics() {
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

  const graphicTotalData = useMemo(() => {
    const categories = ['Artists', 'Musics', 'Musical Genres', 'Users']
    const values = [
      artists.length,
      trackListRemote.length,
      musicalGenres.length,
      users.length,
    ]

    return { categories, values }
  }, [
    artists.length,
    musicalGenres.length,
    trackListRemote.length,
    users.length,
  ])

  const graphicMusicsByGenre = useMemo(() => {
    const categories = musicalGenres.map((genre) => genre.name)

    const values = categories.map(
      (category) =>
        trackListRemote.filter((music) => music.genre.includes(category))
          .length,
    )

    return { categories, values }
  }, [musicalGenres, trackListRemote])

  const graphicArtistsByGenre = useMemo(() => {
    const allGenres = Array.from(
      new Set(
        artists.flatMap((artist) =>
          artist.musicalGenres.map((genre) => genre.name),
        ),
      ),
    )

    const values = allGenres.map(
      (genre) =>
        artists.filter((artist) =>
          artist.musicalGenres.some((g) => g.name === genre),
        ).length,
    )

    return { categories: allGenres, values }
  }, [artists])

  return (
    <div className="mt-8 grid grid-cols-2 gap-12">
      <div>
        <p className="font-bold text-lg pl-4">Total documents in DB</p>
        <ApexCharts
          options={{
            xaxis: {
              categories: graphicTotalData.categories,
            },
            colors: [colors.purple[600]],
          }}
          series={[
            {
              name: 'total',
              data: graphicTotalData.values,
            },
          ]}
          type="bar"
          height={350}
        />
      </div>

      <div />

      <div>
        <p className="font-bold text-lg pl-4">Musics by genre</p>
        <ApexCharts
          options={{
            xaxis: {
              categories: graphicMusicsByGenre.categories,
            },
            colors: [colors.purple[600]],
          }}
          series={[
            {
              name: 'total',
              data: graphicMusicsByGenre.values,
            },
          ]}
          type="bar"
          height={350}
        />
      </div>

      <div>
        <p className="font-bold text-lg pl-4">Artists by genre</p>
        <ApexCharts
          options={{
            xaxis: {
              categories: graphicArtistsByGenre.categories,
            },
            colors: [colors.purple[600]],
          }}
          series={[
            {
              name: 'total',
              data: graphicArtistsByGenre.values,
            },
          ]}
          type="bar"
          height={350}
        />
      </div>
    </div>
  )
}
