// Import Actions
import { ACTIONS } from './ExchangeActions';

// Initial State
const initialState = {
  buyOrders: [],
  sellOrders: [],
};

const ExchangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SELL_ORDER_LIST: {
      return { ...state, sellOrders: action.orders}
    }
    case ACTIONS.BUY_ORDER_LIST: {
      return { ...state, buyOrders: action.orders}
    }
    default:
      return state;
  }
};

/* Selectors */
export const getBuyOrders = state => state.exchange.buyOrders;
export const getSellOrders = state => state.exchange.sellOrders;
// Export Reducer
export default ExchangeReducer;
