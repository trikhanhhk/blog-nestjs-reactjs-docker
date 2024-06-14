import actionType from "../../type"

interface loginState {
  status: boolean;
}

const initialState: loginState = {
  status: false
};

const showLoginModal = (state = initialState, action: actionType): loginState => {
  switch (action.type) {
    case "SHOW_LOGIN_MODAL": {
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

export default showLoginModal;