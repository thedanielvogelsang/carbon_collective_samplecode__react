import {createStore, applyMiddleware, compose} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers';
import thunk from 'redux-thunk';


const initialState = {}
const middleware = [thunk]

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ))
  let persistor = persistStore(store)
  return { store, persistor }
}
