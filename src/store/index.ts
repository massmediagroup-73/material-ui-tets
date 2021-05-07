import { combineReducers } from 'redux'

import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './orders'

const rootReducer = combineReducers({
  orders: postsReducer,
})

const store = configureStore({ reducer: rootReducer })

export default store
