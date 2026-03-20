export type CloudWatchDatapoint = {
  Timestamp?: Date
  Average?: number
  Sum?: number
  Minimum?: number
  Maximum?: number
  Unit?: string
}

export type GetMetricStatisticsOutput = {
  Label?: string
  Datapoints?: CloudWatchDatapoint[]
}

export interface MetricsOverviewByGenreProps {
  genreId: string
  title: string
  slug: string
  total: number
}

export interface MetricsOverviewProps {
  totals: {
    documents: number
    artists: number
    musics: number
    genres: number
    users: number
  }
  musicsByGenre: MetricsOverviewByGenreProps[]
  artistsByGenre: MetricsOverviewByGenreProps[]
}
