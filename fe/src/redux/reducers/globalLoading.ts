import actionType from "../../type"

interface LoadingState {
  status: boolean;
}

const initialState: LoadingState = {
  status: false
};

const globalLoading = (state = initialState, action: actionType): LoadingState => {
  switch (action.type) {
    case "CONTROL_LOADING": {
      state = {
        status: action.payload
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default globalLoading;