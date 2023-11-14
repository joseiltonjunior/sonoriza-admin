import { configureStore } from '@reduxjs/toolkit'

import sideMenuReducer, { SideMenuProps } from './modules/sideMenu/reducer'
import trackListRemoteReducer, {
  TrackListRemoteProps,
} from './modules/trackListRemote/reducer'

import artistsReducer, { ArtistsProps } from './modules/artists/reducer'
import musicalGenresReducers, {
  MusicalGenresProps,
} from './modules/musicalGenres/reducer'
import userReducer, { UsersProps } from './modules/users/reducer'

export interface ReduxProps {
  sideMenu: SideMenuProps
  trackListRemote: TrackListRemoteProps
  musicalGenres: MusicalGenresProps
  artists: ArtistsProps
  users: UsersProps
}

const store = configureStore({
  reducer: {
    sideMenu: sideMenuReducer,
    trackListRemote: trackListRemoteReducer,
    artists: artistsReducer,
    musicalGenres: musicalGenresReducers,
    users: userReducer,
  },
})

export { store }
