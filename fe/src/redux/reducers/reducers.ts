import { combineReducers } from 'redux';
import globalLoading from './globalLoading';
import userReducer from './userReducer';
import showLoginModal from './globalLogin';


const appReducers = combineReducers({
  globalLoading: globalLoading,
  userReducer: userReducer,
  showLoginModal: showLoginModal,
});

export default appReducers;


export type RootState = ReturnType<typeof appReducers>;