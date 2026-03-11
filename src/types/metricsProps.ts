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
