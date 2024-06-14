import actionType from "../../type";
// import { UserData } from "../../types/UserData";

interface UserState {
  user: any | null;
}

const initialState: UserState = {
  user: null
}

const userReducer = (state: UserState = initialState, action: actionType): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };

    default: {
      return state;
    }
  }
}

export default userReducer;