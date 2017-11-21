import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';
// Export Constants
export const ACTIONS = {
  BUY_ORDER_LIST: 'BUY_ORDER_LIST',
  SELL_ORDER_LIST: 'SELL_ORDER_LIST',
};

export function createOrder(token, order) {
  return () => {
    return callApi('order', 'post', token, { order }).then(res => {
      return res;
    });
  };
};
export function addBuyOrders(orders){
  return {
    type: ACTIONS.BUY_ORDER_LIST,
    orders,
  };
}
export function getBuyOrder(coin) {
  return (dispatch) => {
    return callApi(`order/${coin}/buy`).then(res => {
      dispatch(addBuyOrders(res.order));
    });
  };
}
export function addSellOrders(orders){
  return {
    type: ACTIONS.SELL_ORDER_LIST,
    orders,
  };
}
export function getSellOrder(coin) {
  return (dispatch) => {
    return callApi(`order/${coin}/sell`).then(res => {
      dispatch(addSellOrders(res.order));
    });
  };
}
