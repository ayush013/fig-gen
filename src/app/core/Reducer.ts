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
        },
      };
    case ActionTypes.SET_MARKUP_IN_PROGRESS:
      return {
        ...state,
        markup: {
          ...state.markup,
          inProgress: true,
        },
      };
    case ActionTypes.SET_MARKUP_ERROR:
      return {
        ...state,
        markup: {
          ...state.markup,
          error: action.payload,
          inProgress: false,
        },
      };
    default:
      return state;
  }
};
