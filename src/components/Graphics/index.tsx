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

  const graphicData = useMemo(() => {
    const format = {
      categories: ['Artists', 'Musics', 'Musical Genres', 'Users'],
      values: [
        artists.length,
        trackListRemote.length,
        musicalGenres.length,
        users.length,
      ],
    }
    return format
  }, [
    artists.length,
    musicalGenres.length,
    trackListRemote.length,
    users.length,
  ])

  const options = {
    xaxis: {
      categories: graphicData.categories,
    },
    colors: [colors.purple[600]],
  }

  const series = [
    {
      name: 'total',
      data: graphicData.values,
    },
  ]

  return (
    <div className="mt-8">
      <ApexCharts options={options} series={series} type="bar" height={350} />
    </div>
  )
}
