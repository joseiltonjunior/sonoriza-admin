import { legacy_createStore as createStore } from 'redux'
import rootReducer from './modules/rootReducer'
import { ProgressProps } from './modules/progress/type'

export interface ReduxProps {
  progress: ProgressProps
}

const store = createStore(rootReducer)

export { store }
