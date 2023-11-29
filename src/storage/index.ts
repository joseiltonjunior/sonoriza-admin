import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { SideMenuProps } from './modules/sideMenu/reducer'
import { TrackListRemoteProps } from './modules/trackListRemote/reducer'
import { ArtistsProps } from './modules/artists/reducer'
import { MusicalGenresProps } from './modules/musicalGenres/reducer'
import { UsersProps } from './modules/users/reducer'
import { AdminDataProps } from './modules/admin/reducer'
import rootReducer from './modules/rootReducer'

export interface ReduxProps {
  sideMenu: SideMenuProps
  trackListRemote: TrackListRemoteProps
  musicalGenres: MusicalGenresProps
  artists: ArtistsProps
  users: UsersProps
  admin: AdminDataProps
}

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['sideMenu'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor }
