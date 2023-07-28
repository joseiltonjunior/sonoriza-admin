import { Reducer } from 'redux'
import {
  ProgressProps,
  SET_INCREMENT_PROGRESS,
  SET_DECREMENT_PROGRESS,
} from './type'

const INITIAL_STATE: ProgressProps = { progress: 2 }

const progress: Reducer<ProgressProps> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_INCREMENT_PROGRESS: {
      return (state = { progress: state.progress + 1 })
    }

    case SET_DECREMENT_PROGRESS: {
      return (state = { progress: state.progress - 1 })
    }

    default: {
      return state
    }
  }
}

export default progress
