import ActionTypes from "./ActionTypes";
import { IState, IAction, initialState } from "./Store";

export const appReducer = (
  state: IState = initialState,
  action: IAction<any>
): IState => {
  switch (action.type) {
    case ActionTypes.SET_MARKUP:
      return {
        ...state,
        markup: {
          ...state.markup,
          error: null,
          data: action.payload,
          inProgress: false,
        },
      };
    case ActionTypes.SET_IN_PROGRESS:
      return {
        ...state,
        markup: {
          ...state.markup,
          inProgress: true,
        },
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        markup: {
          ...state.markup,
          error: action.payload,
          inProgress: false,
        },
      };
    case ActionTypes.SET_SELECTED_FRAME:
      return {
        ...state,
        selectedFrame: action.payload,
      };
    case ActionTypes.RESET_APP_STATE:
      return initialState;
    default:
      return state;
  }
};
