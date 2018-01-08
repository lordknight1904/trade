// Import Actions
import { ACTIONS } from './AppActions';

// Initial State
const initialState = {
  isSignUp: false,
  isSignIn: false,

  isNotify: false,
  message: '',

  id: '',
  email: '',
  userName: '',
  token: '',
  googleAuthentication: false,
  googleSecret: {},

  coin: 'BTC',
  coinList: [
    { name: 'USDT', unit: 100000, fee: 50000 },
    { name: 'BTC', unit: 100000000, fee: 50000 },
    { name: 'ETH', unit: 1000000000000000000, fee: 0 },
  ],

  isSubmitting: false,
  approved: false,
  realName: '',
  phone: '',
  isInform: false,
  requireInform: [],

  socketIO: {},

  wallets: {},
  openOrders: [],
  cancelOrders: [],
  doneOrders: [],

  transaction: [],

  detail: false,
  transactionDetail: {},
  confirmations: -1,

  historyPage: 1,
  historyMaxPage: 1,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_USER_PROFILE:
      return {
        ...state,
        isSubmitting: action.user.isSubmitting,
        approved: action.user.approved,
      };
    case ACTIONS.SET_HISTORY_PAGE:
      return { ...state, historyPage: action.page };
    case ACTIONS.SET_HISTORY_MAX_PAGE:
      return { ...state, historyMaxPage: action.page };
    case ACTIONS.SET_IS_SUBMITTING:
      return { ...state, isSubmitting: true };
    case ACTIONS.SET_CONFIRMATION:
      return { ...state, confirmations: action.confirmations };
    case ACTIONS.SET_TRANSACTION_DETAIL:
      return { ...state, detail: true, transactionDetail: action.transaction };
    case ACTIONS.CLOSE_TRANSACTION:
      return { ...state, detail: false };
    case ACTIONS.COIN:
      return { ...state, coin: action.coin };
    case ACTIONS.ON_SIGN_IN:
      return { ...state, isSignIn: true, isSignUp: false };
    case ACTIONS.ON_SIGN_UP:
      return { ...state, isSignIn: false, isSignUp: true };
    case ACTIONS.ON_CLOSE_SIGN:
      return { ...state, isSignIn: false, isSignUp: false };
    case ACTIONS.SET_NOTIFY:
      return { ...state, isNotify: true, message: action.message };
    case ACTIONS.CLOSE_NOTIFY:
      return { ...state, isNotify: false, message: '' };
    case ACTIONS.LOGIN:
      return {
        ...state,
        id: action.user.id,
        email: action.user.email,
        userName: action.user.userName,
        token: action.user.token,
        googleAuthentication: action.user.googleAuthentication,
        googleSecret: action.user.googleSecret,
        isSubmitting: action.user.isSubmitting,
        approved: action.user.approved,
        realName: action.user.realName,
        isInform: action.user.isInform,
        requireInform: action.user.requireInform,
        phone: action.user.phone,
      };
    case ACTIONS.REFETCH_USER_PROFILE:
      return {
        ...state,
        email: action.user.email,
        userName: action.user.userName,
        token: action.user.token,
        googleAuthentication: action.user.googleAuthentication,
        googleSecret: action.user.googleSecret,
        isSubmitting: action.user.isSubmitting,
        approved: action.user.approved,
        realName: action.user.realName,
        isInform: action.user.isInform,
        requireInform: action.user.requireInform,
        phone: action.user.phone,
      };
    case ACTIONS.LOGOUT: {
      return {...state, id: '', email: '', userName: '', token: ''};
    }
    case ACTIONS.SET_CHAT_SOCKET:
      return { ...state, socketIO: action.socketIO };
    case ACTIONS.UPDATE_BALANCE_HOLD: {
      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet.coin]: action.wallet
        }
      };
    }
    case ACTIONS.UPDATE_HOLD: {
      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet.coin]: {
            ...state.wallets[action.wallet.coin],
            hold: action.wallet.hold,
            unconfirmedBalance: action.wallet.unconfirmedBalance
          }
        }
      };
    }
    case ACTIONS.OPEN_ORDERS: {
      return { ...state, openOrders: action.orders}
    }
    case ACTIONS.CANCEL_ORDERS: {
      return { ...state, cancelOrders: action.orders}
    }
    case ACTIONS.DONE_ORDERS: {
      return { ...state, doneOrders: action.orders}
    }
    case ACTIONS.TRANSACTION: {
      return { ...state, transaction: action.transaction}
    }

    default:
      return state;
  }
};

/* Selectors */

// Get showAddPost
export const getSignUp = state => state.app.isSignUp;
export const getSignIn = state => state.app.isSignIn;
export const getIsNotify = state => state.app.isNotify;
export const getMessage = state => state.app.message;
export const getSocket = state => state.app.socketIO;

export const getId = state => state.app.id;
export const getEmail = state => state.app.email;
export const getUserName = state => state.app.userName;
export const getGoogleAuthentication = state => state.app.googleAuthentication;
export const getGoogleSecret = state => state.app.googleSecret;
export const getToken = state => state.app.token;
export const getCoin = state => state.app.coin;
export const getCoinList = state => state.app.coinList;
export const getWallet = state => state.app.wallets;
export const getOpenOrders = state => state.app.openOrders;
export const getCancelOrders = state => state.app.cancelOrders;
export const getDoneOrders = state => state.app.doneOrders;
export const getTransaction = state => state.app.transaction;
export const getIsSubmitting = state => state.app.isSubmitting;
export const getApproved = state => state.app.approved;
export const getRealName = state => state.app.realName;
export const getPhone = state => state.app.phone;
export const getRequireInform = state => state.app.requireInform;

export const getDetail = state => state.app.detail;
export const getTransactionDetail = state => state.app.transactionDetail;
export const getConfirmations = state => state.app.confirmations;

export const getHistoryPage = state => state.app.historyPage;
export const getHistoryMaxPage = state => state.app.historyMaxPage;

// Export Reducer
export default AppReducer;
