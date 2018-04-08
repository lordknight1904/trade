// Import Actions
import { ACTIONS } from './ExchangeActions';

// Initial State
const initialState = {
  buyOrders: [],
  sellOrders: [],

  rate: {},
  chartIndex: 0,
};

const ExchangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_CHART_INDEX: {
      return { ...state, chartIndex: action.chartIndex };
    }
    case ACTIONS.SELL_ORDER_LIST: {
      return { ...state, sellOrders: action.orders };
    }
    case ACTIONS.BUY_ORDER_LIST: {
      return { ...state, buyOrders: action.orders };
    }
    case ACTIONS.UPDATE_RATE: {
      return {
        ...state,
        rate: {
          ...state.rate,
          [action.rate.coin]: action.rate,
        },
      };
    }
    default:
      return state;
  }
};

/* Selectors */
export const getBuyOrders = state => state.exchange.buyOrders;
export const getChartIndex = state => state.exchange.chartIndex;
export const getSellOrders = state => state.exchange.sellOrders;
export const getRate = state => state.exchange.rate;
// Export Reducer
export default ExchangeReducer;
