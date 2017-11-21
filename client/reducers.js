/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import app from './modules/App/AppReducer';
import user from './modules/User/UserReducer';
import exchange from './modules/Exchange/ExchangeReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  app,
  user,
  exchange,
});
