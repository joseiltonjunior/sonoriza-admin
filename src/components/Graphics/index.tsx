import ApexCharts from 'react-apexcharts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import colors from 'tailwindcss/colors'

import {
  GetMetricStatisticsOutput,
  MetricsOverviewProps,
} from '@/types/metricsProps'

interface GraphicsProps {
  metricsS3: GetMetricStatisticsOutput[]
  metricsOverview: MetricsOverviewProps | null
}

interface GraphicData {
  bucketSizeCategories: string[]
  bucketSizeValues: number[]
  numberOfObjectsCategories: string[]
  numberOfObjectsValues: number[]
}

export function Graphics({ metricsS3, metricsOverview }: GraphicsProps) {
  const [chartMetricsS3, setChartMetricsS3] = useState<GraphicData>()

  const graphicTotalData = useMemo(() => {
    const categories = ['Artists', 'Musics', 'Musical Genres', 'Users']
    const values = [
      metricsOverview?.totals.artists ?? 0,
      metricsOverview?.totals.musics ?? 0,
      metricsOverview?.totals.genres ?? 0,
      metricsOverview?.totals.users ?? 0,
    ]

    return { categories, values }
  }, [metricsOverview])

  const graphicMusicsByGenre = useMemo(() => {
    const categories =
      metricsOverview?.musicsByGenre.map((genre) => genre.title) ?? []
    const values =
      metricsOverview?.musicsByGenre.map((genre) => genre.total) ?? []

    return { categories, values }
  }, [metricsOverview])

  const graphicArtistsByGenre = useMemo(() => {
    const categories =
      metricsOverview?.artistsByGenre.map((genre) => genre.title) ?? []
    const values =
      metricsOverview?.artistsByGenre.map((genre) => genre.total) ?? []

    return { categories, values }
  }, [metricsOverview])

  const convertBytesToMB = (bytes: number) => {
    const mbValue = bytes / 1024 ** 2
    return Number(mbValue.toFixed(2))
  }

  const formatChartDate = (date: Date) =>
    new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date)

  const graphicData = useCallback(() => {
    const bucketSizeData = metricsS3.find(
      (item) => item.Label === 'BucketSizeBytes',
    )
    const numberOfObjectsData = metricsS3.find(
      (item) => item.Label === 'NumberOfObjects',
    )

    const formattedBucketSizeData =
      bucketSizeData?.Datapoints?.filter(
        (point) => point.Timestamp !== undefined && point.Average !== undefined,
      )
        .map((point) => ({
          timestamp: new Date(point.Timestamp!),
          average: convertBytesToMB(point.Average!),
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) ?? []

    const formattedNumberOfObjectsData =
      numberOfObjectsData?.Datapoints?.filter(
        (point) => point.Timestamp !== undefined && point.Average !== undefined,
      )
        .map((point) => ({
          timestamp: new Date(point.Timestamp!),
          average: point.Average!,
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) ?? []

    setChartMetricsS3({
      bucketSizeCategories: formattedBucketSizeData.map((point) =>
        formatChartDate(point.timestamp),
      ),
      bucketSizeValues: formattedBucketSizeData.map((point) => point.average),
      numberOfObjectsCategories: formattedNumberOfObjectsData.map((point) =>
        formatChartDate(point.timestamp),
      ),
      numberOfObjectsValues: formattedNumberOfObjectsData.map(
        (point) => point.average,
      ),
    })
  }, [metricsS3])

  useEffect(() => {
    graphicData()
  }, [graphicData])

  return (
    <div className="mt-8 grid grid-cols-2 gap-12">
      {chartMetricsS3 && (
        <div>
          <ApexCharts
            options={{
              xaxis: {
                categories: chartMetricsS3.bucketSizeCategories,
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

      {chartMetricsS3 && (
        <div>
          <ApexCharts
            options={{
              xaxis: {
                categories: chartMetricsS3.numberOfObjectsCategories,
              },
              colors: [colors.blue[600]],
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
                data: chartMetricsS3.numberOfObjectsValues,
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
              text: 'Total documents',
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
                      formatter: (w) =>
                        w.globals.seriesTotals
                          .reduce(
                            (acc: number, value: number) => acc + value,
                            0,
                          )
                          .toString(),
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
                      formatter: (w) =>
                        w.globals.seriesTotals
                          .reduce(
                            (acc: number, value: number) => acc + value,
                            0,
                          )
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
                      formatter: (w) =>
                        w.globals.seriesTotals
                          .reduce(
                            (acc: number, value: number) => acc + value,
                            0,
                          )
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
