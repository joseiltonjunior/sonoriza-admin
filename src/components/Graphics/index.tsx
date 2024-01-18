import { ReduxProps } from '@/storage'
import { ArtistsProps } from '@/storage/modules/artists/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { TrackListRemoteProps } from '@/storage/modules/trackListRemote/reducer'
import { UsersProps } from '@/storage/modules/users/reducer'
import ApexCharts from 'react-apexcharts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

interface GraphicsProps {
  metricsS3: AWS.CloudWatch.GetMetricStatisticsOutput[]
}

interface GraphicData {
  categories: string[]
  bucketSizeValues: number[]
  numberOfObjectsValues: number[]
}

export function Graphics({ metricsS3 }: GraphicsProps) {
  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )
  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const [chartMetricsS3, setChartMetricsS3] = useState<GraphicData>()

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

  console.log(graphicArtistsByGenre)

  const totalItems = graphicTotalData.values.reduce(
    (acc, value) => acc + value,
    0,
  )

  const convertBytesToMB = (bytes: number) => {
    const mbValue = bytes / 1024 ** 2
    return Number(mbValue.toFixed(2))
  }

  const graphicData = useCallback(() => {
    const bucketSizeData = metricsS3.find(
      (item) => item.Label === 'BucketSizeBytes',
    )
    const numberOfObjectsData = metricsS3.find(
      (item) => item.Label === 'NumberOfObjects',
    )

    if (!bucketSizeData?.Datapoints || !numberOfObjectsData?.Datapoints) {
      setChartMetricsS3({
        bucketSizeValues: [],
        categories: [],
        numberOfObjectsValues: [],
      })
      return
    }

    const formattedBucketSizeData = bucketSizeData.Datapoints.filter(
      (point) => point.Timestamp !== undefined && point.Average !== undefined,
    )
      .map((point) => ({
        timestamp: new Date(point.Timestamp!),
        average: convertBytesToMB(point.Average!),
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    const categories = formattedBucketSizeData.map((point) => {
      const formatoData = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
      return formatoData.format(point.timestamp)
    })

    const bucketSizeValues = formattedBucketSizeData.map(
      (point) => point.average,
    )

    const numberOfObjectsValues = numberOfObjectsData.Datapoints.filter(
      (point) => point.Average !== undefined,
    ).map((point) => point.Average!)

    setChartMetricsS3({ bucketSizeValues, categories, numberOfObjectsValues })
  }, [metricsS3])

  useEffect(() => {
    if (metricsS3) {
      graphicData()
    }
  }, [graphicData, metricsS3])

  return (
    <div className="mt-8 grid grid-cols-2 gap-12">
      {chartMetricsS3 && chartMetricsS3.bucketSizeValues && (
        <div>
          <ApexCharts
            options={{
              xaxis: {
                categories: chartMetricsS3.categories,
              },
              colors: [colors.purple[600]],
              stroke: {
                width: 5,
                curve: 'smooth',
              },
              title: {
                text: 'S3 - Bucket Size Bytes',
                align: 'left',
                style: {
                  fontSize: '16px',
                  color: colors.gray[700],
                },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  gradientToColors: [colors.gray[300]],
                  shadeIntensity: 1,
                  type: 'horizontal',
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100, 100, 100],
                },
              },
            }}
            series={[
              {
                name: 'BucketSizeBytes',
                data: chartMetricsS3.bucketSizeValues,
              },
            ]}
            type="line"
            height={300}
          />
        </div>
      )}

      {chartMetricsS3 && chartMetricsS3.numberOfObjectsValues && (
        <div>
          <ApexCharts
            options={{
              labels: chartMetricsS3.categories,
              colors: [
                colors.purple[600],
                colors.blue[600],
                colors.green[600],
                colors.orange[600],
              ],
              stroke: {
                width: 5,
                curve: 'smooth',
              },
              title: {
                text: 'S3 - Number Of Objects',
                align: 'left',
                style: {
                  fontSize: '16px',
                  color: colors.gray[700],
                },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  gradientToColors: [colors.gray[300]],
                  shadeIntensity: 1,
                  type: 'horizontal',
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100, 100, 100],
                },
              },
            }}
            series={[
              {
                name: 'NumberOfObjects',
                data: chartMetricsS3.numberOfObjectsValues.sort(
                  (a, b) => a - b,
                ),
              },
            ]}
            type="line"
            height={300}
          />
        </div>
      )}
      <div>
        <ApexCharts
          options={{
            labels: graphicTotalData.categories,
            colors: [
              colors.purple[600],
              colors.blue[600],
              colors.green[600],
              colors.orange[600],
            ],
            title: {
              text: 'Firebase - Total documents',
              align: 'left',
              style: {
                fontSize: '16px',
                color: colors.gray[700],
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Items',
                      formatter: () => totalItems.toString(),
                    },
                  },
                },
              },
            },
          }}
          series={graphicTotalData.values}
          type="donut"
          height={300}
        />
      </div>

      <div>
        <ApexCharts
          options={{
            title: {
              text: 'Musics by genre',
              align: 'left',
              style: {
                fontSize: '16px',
                color: colors.gray[700],
              },
            },
            labels: graphicMusicsByGenre.categories,
            colors: [
              colors.purple[600],
              colors.blue[600],
              colors.green[600],
              colors.orange[600],
              colors.rose[600],
              colors.amber[600],
              colors.black,
              colors.cyan[600],
              colors.indigo[600],
              colors.lime[600],
              colors.emerald[600],
              colors.gray[600],
              colors.red[600],
              colors.sky[600],
              colors.teal[600],
            ],
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Musics',
                      formatter: () =>
                        graphicMusicsByGenre.values
                          .reduce((acc, value) => acc + value, 0)
                          .toString(),
                    },
                  },
                },
              },
            },
          }}
          series={graphicMusicsByGenre.values}
          type="donut"
          height={300}
        />
      </div>

      <div>
        <ApexCharts
          options={{
            labels: graphicArtistsByGenre.categories,
            colors: [
              colors.purple[600],
              colors.blue[600],
              colors.green[600],
              colors.orange[600],
              colors.rose[600],
              colors.amber[600],
              colors.black,
              colors.cyan[600],
              colors.indigo[600],
              colors.lime[600],
              colors.emerald[600],
              colors.gray[600],
              colors.red[600],
              colors.sky[600],
              colors.teal[600],
            ],
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: 'Total Artists',
                      formatter: () =>
                        graphicArtistsByGenre.values
                          .reduce((acc, value) => acc + value, 0)
                          .toString(),
                    },
                  },
                },
              },
            },
            title: {
              text: 'Artists by genre',
              align: 'left',
              style: {
                fontSize: '16px',
                color: colors.gray[700],
              },
            },
          }}
          series={graphicArtistsByGenre.values}
          type="donut"
          height={300}
        />
      </div>
    </div>
  )
}
