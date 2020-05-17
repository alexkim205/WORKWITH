import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootReducer from '../_reducers';

// Persist in AsyncStorage
const persistConfig = {
  key: 'root',
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middlewares
const middlewares = [thunk];
const composeEnhancers =
  process.env.REACT_APP_ENV === 'development'
    ? composeWithDevTools({ trace: true, traceLimit: 25 })
    : compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);
