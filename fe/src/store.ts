import { legacy_createStore as createStore, Store } from "redux";
import appReducers from "./redux/reducers/reducers";


const store: Store = createStore(appReducers);

export default store;