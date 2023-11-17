import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SideMenuProps {
  tag: 'musics' | 'artists' | 'genres' | 'users' | 'signUrl' | 'graphics'
}

const initialState: SideMenuProps = {
  tag: 'musics',
}

const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {
    handleSetTag(state, action: PayloadAction<SideMenuProps>) {
      state.tag = action.payload.tag
    },
  },
})

export const { handleSetTag } = sideMenuSlice.actions

export default sideMenuSlice.reducer
