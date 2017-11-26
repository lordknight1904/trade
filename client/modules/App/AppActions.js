import callApi from '../../util/apiCaller';
import localStorage from 'localStorage';
// Export Constants
export const ACTIONS = {
  ON_SIGN_IN: 'ON_SIGN_IN',
  ON_SIGN_UP: 'ON_SIGN_UP',
  ON_CLOSE_SIGN: 'ON_CLOSE_SIGN',
  SET_NOTIFY: 'SET_NOTIFY',
  CLOSE_NOTIFY: 'CLOSE_NOTIFY',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  COIN: 'COIN',
  SET_CHAT_SOCKET: 'SET_CHAT_SOCKET',
  UPDATE_BALANCE_HOLD: 'UPDATE_BALANCE_HOLD',
  UPDATE_HOLD: 'UPDATE_HOLD',
  CANCEL_ORDERS: 'CANCEL_ORDERS',
  OPEN_ORDERS: 'OPEN_ORDERS',
  DONE_ORDERS: 'DONE_ORDERS',
  TRANSACTION: 'TRANSACTION',
  SET_TRANSACTION_DETAIL: 'SET_TRANSACTION_DETAIL',
  CLOSE_TRANSACTION: 'CLOSE_TRANSACTION',
  SET_CONFIRMATION: 'SET_CONFIRMATION',
  SET_IS_SUBMITTING: 'SET_IS_SUBMITTING',
  REFETCH_USER_PROFILE: 'REFETCH_USER_PROFILE',
  SET_HISTORY_PAGE: 'SET_HISTORY_PAGE',
  SET_HISTORY_MAX_PAGE: 'SET_HISTORY_MAX_PAGE',
};
export function setHistoryMaxPage(page) {
  return {
    type: ACTIONS.SET_HISTORY_MAX_PAGE,
    page
  };
}
export function setHistoryPage(page) {
  return {
    type: ACTIONS.SET_HISTORY_PAGE,
    page
  };
}
export function refetchUserProfile(user) {
  return {
    type: ACTIONS.REFETCH_USER_PROFILE,
    user
  };
}
export function setConfirmation(confirmations) {
  return {
    type: ACTIONS.SET_CONFIRMATION,
    confirmations
  };
}
export function getConfirmation(coin, txHash) {
  return (dispatch) => {
    return callApi(`transaction/hash/${coin}/${txHash}`, 'get', '' ).then(res => {
      dispatch(setConfirmation(res.confirmations));
    });
  };
}

export function setTransactionDetail(transaction) {
  return {
    type: ACTIONS.SET_TRANSACTION_DETAIL,
    transaction
  };
}
export function closeTransactionDetail() {
  return {
    type: ACTIONS.CLOSE_TRANSACTION,
  };
}
export function changeCoin(coin) {
  return {
    type: ACTIONS.COIN,
    coin
  };
}
export function setSocket(socketIO) {
  return {
    type: ACTIONS.SET_CHAT_SOCKET,
    socketIO
  };
}
export function onSignIn() {
  return {
    type: ACTIONS.ON_SIGN_IN,
  };
}
export function onSignUp() {
  return {
    type: ACTIONS.ON_SIGN_UP,
  };
}
export function onCloseSign() {
  return {
    type: ACTIONS.ON_CLOSE_SIGN,
  };
}

export function createUser(user) {
  return () => {
    return callApi('user/create', 'post', '', {user}).then(res => {
      return res;
    });
  };
}

export function setNotify(message) {
  return {
    type: ACTIONS.SET_NOTIFY,
    message
  };
}
export function closeNotify() {
  return {
    type: ACTIONS.CLOSE_NOTIFY,
  };
}
export function login(user) {
  return {
    type: ACTIONS.LOGIN,
    user
  };
}
export function logout() {
  return {
    type: ACTIONS.LOGOUT,
  };
}

export function loginRequest(user) {
  return () => {
    return callApi('user/login', 'post', '', {user}).then(res => {
      return res;
    });
  };
}

export function updateBalanceAndHold(wallet) {
  return {
    type: ACTIONS.UPDATE_BALANCE_HOLD,
    wallet
  };
}
export function getBalance(userName, coin) {
  return (dispatch) => {
    return callApi(`user/balance/${userName}/${coin}`, 'get', '' ).then(res => {
      dispatch(updateBalanceAndHold(res.user));
    });
  };
}
export function updateHold(wallet) {
  return {
    type: ACTIONS.UPDATE_HOLD,
    wallet
  };
}
export function getHold(userName, coin) {
  return (dispatch) => {
    return callApi(`user/hold/${userName}/${coin}`, 'get', '' ).then(res => {
      console.log(res);
      dispatch(updateHold(res.user));
    });
  };
}
export function addDone(orders){
  return {
    type: ACTIONS.DONE_ORDERS,
    orders,
  };
}

export function addCancel(orders){
  return {
    type: ACTIONS.CANCEL_ORDERS,
    orders,
  };
}
export function addOpen(orders){
  return {
    type: ACTIONS.OPEN_ORDERS,
    orders,
  };
}
export function getMyOrders(userName, coin) {
  return (dispatch) => {
    return callApi(`order/individual/${coin}/${userName}`).then(res => {
      dispatch(addCancel(res.order.cancel));
      dispatch(addOpen(res.order.open));
      dispatch(addDone(res.order.done));
    });
  };
}
export function addTransaction(transaction){
  return {
    type: ACTIONS.TRANSACTION,
    transaction,
  };
}
export function setIsSubmitting(){
  return {
    type: ACTIONS.SET_IS_SUBMITTING,
  };
}
export function fetchTransaction(userName, coin, page) {
  return (dispatch) => {
    return callApi(`/history/${userName}/${coin}?page=${page}`).then(res => {
      dispatch(addTransaction(res.transaction));
      dispatch(setHistoryMaxPage(res.count));
      dispatch(setHistoryPage(1));
    });
  };
}
export function deleteOrder(del) {
  return () => {
    return callApi('order', 'delete', '', {del}).then(res => {
      return res;
    });
  };
}
export function googleAuth(user) {
  return () => {
    return callApi('user/google/active', 'post', '', {user}).then(res => {
      return res;
    });
  };
}
export function googleFactor(user) {
  return () => {
    return callApi('user/google/authorize', 'post', '', {user}).then(res => {
      return res;
    });
  };
}
export function cancelGoogle(user) {
  return () => {
    return callApi('user/google/cancel', 'post', '', {user}).then(res => {
      return res;
    });
  };
}
export function directSend(send) {
  return () => {
    return callApi('order/send', 'post', '', {send}).then(res => {
      return res;
    });
  };
}
export function updateProfile(profile) {
  return () => {
    return callApi('user/profile', 'post', '', {profile}).then(res => {
      return res;
    });
  };
}
export function addInform(inform) {
  return () => {
    return callApi('user/inform', 'post', '', {inform}).then(res => {
      return res;
    });
  };
}
export function deleteInform(inform) {
  return () => {
    return callApi('user/inform', 'delete', '', {inform}).then(res => {
      return res;
    });
  };
}
