/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DevTools from './modules/App/components/DevTools';
import rootReducer from './reducers';

function timestampAction(action) {
  return {
    action,
    time: Date.now()
  }
}
function storageMiddleware({ getState, dispatch }) {
  return next => action => {
    const stampedAction = timestampAction(action);
    if ( action.type !== 'SET_CHAT_SOCKET') {
      localStorage.setItem('SYNCHRONIZE', JSON.stringify(stampedAction));
    } else {
      // console.log(action);
    }
    next(action);
  }
}
export function configureStore(initialState = {}) {
  // Middleware and store enhancers
  const enhancers = [
    applyMiddleware(thunk, storageMiddleware),
  ];

  if (process.env.CLIENT && process.env.NODE_ENV === 'development') {
    // Enable DevTools only when rendering on client and during development.
    enhancers.push(window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument());
  }

  const store = createStore(rootReducer, initialState, compose(...enhancers));

  // For hot reloading reducers
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
