import { AdminProps } from '@/types/adminsProps'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AdminDataProps {
  admin: AdminProps
}

const initialState: AdminDataProps = {
  admin: { email: '', id: '', name: '', photoURL: '' },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    handleSetAdmin(state, action: PayloadAction<AdminDataProps>) {
      state.admin = action.payload.admin
    },
  },
})

export const { handleSetAdmin } = adminSlice.actions

export default adminSlice.reducer
