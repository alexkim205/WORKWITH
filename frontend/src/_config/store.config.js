import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import rootReducer from "../_reducers";

// Persist in AsyncStorage
const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middlewares
const middlewares = [applyMiddleware(thunk)];
export default () => {
  const store = createStore(persistedReducer, compose(...middlewares));
  const persistor = persistStore(store);
  return { store, persistor };
};
