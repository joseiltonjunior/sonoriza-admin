import { combineReducers } from '@reduxjs/toolkit'

import sideMenu from './sideMenu/reducer'
import artists from './artists/reducer'
import trackListRemote from './trackListRemote/reducer'
import musicalGenres from './musicalGenres/reducer'
import users from './users/reducer'

export default combineReducers({
  sideMenu,
  artists,
  trackListRemote,
  musicalGenres,
  users,
})
