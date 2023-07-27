import { SET_INCREMENT_PROGRESS, SET_DECREMENT_PROGRESS } from './type'

export function setIncrementProgress() {
  return {
    type: SET_INCREMENT_PROGRESS,
  }
}

export function setDecrementProgress() {
  return {
    type: SET_DECREMENT_PROGRESS,
  }
}
