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

let store;

// if (window.navigator.userAgent.includes('Chrome')) {
//     store = createStore(
//       persistedReducer,
//       initialState,
//       compose(
//         applyMiddleware(...middleware),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//       )
//     );
//   } else {
//
//   }

store = createStore(
  persistedReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
  )
);

const persistor = persistStore(store)

export { store, persistor }
