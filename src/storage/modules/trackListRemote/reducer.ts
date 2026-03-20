import { MusicResponseProps } from '@/types/musicProps'
import { EMPTY_PAGINATION_META } from '@/types/paginationProps'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TrackListRemoteProps {
  trackListRemote: MusicResponseProps[]
  currentPage: number
  lastPage: number
  totalItems: number
}

const initialState: TrackListRemoteProps = {
  trackListRemote: [],
  ...EMPTY_PAGINATION_META,
}

const trackListSlice = createSlice({
  name: 'trackListRemote',
  initialState,
  reducers: {
    handleTrackListRemote(state, action: PayloadAction<TrackListRemoteProps>) {
      state.trackListRemote = action.payload.trackListRemote
      state.currentPage = action.payload.currentPage
      state.lastPage = action.payload.lastPage
      state.totalItems = action.payload.totalItems
    },
    handleAppendTrackListRemote(
      state,
      action: PayloadAction<TrackListRemoteProps>,
    ) {
      const existingIds = new Set(
        state.trackListRemote.map((music) => music.id),
      )
      const nextItems = action.payload.trackListRemote.filter(
        (music) => !existingIds.has(music.id),
      )

      state.trackListRemote = [...state.trackListRemote, ...nextItems]
      state.currentPage = action.payload.currentPage
      state.lastPage = action.payload.lastPage
      state.totalItems = action.payload.totalItems
    },
  },
})

export const { handleTrackListRemote, handleAppendTrackListRemote } =
  trackListSlice.actions

export default trackListSlice.reducer
