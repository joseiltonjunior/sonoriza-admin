import { configureStore } from '@reduxjs/toolkit'

import sideMenuReducer, { SideMenuProps } from './modules/sideMenu/reducer'

export interface ReduxProps {
  sideMenu: SideMenuProps
}

const store = configureStore({
  reducer: {
    sideMenu: sideMenuReducer,
  },
})

export { store }
