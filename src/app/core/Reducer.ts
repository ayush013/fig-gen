import ActionTypes, {
  ResetAppStateAction,
  SetErrorAction,
  SetInProgressAction,
  SetMarkupAction,
  SetNodeAction,
  SetSelectedFrameAction,
  SetSplashAction,
} from "./ActionTypes";
import { IState, IAction, initialState } from "./Store";

export const appReducer = (
  state: IState = initialState,
  action: IAction<any>
): IState => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.SET_MARKUP:
      if (action instanceof SetMarkupAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            error: null,
            data: payload,
            inProgress: false,
          },
        };
      }
    case ActionTypes.SET_IN_PROGRESS:
      if (action instanceof SetInProgressAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            inProgress: true,
          },
        };
      }
    case ActionTypes.SET_ERROR:
      if (action instanceof SetErrorAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            error: payload,
            inProgress: false,
          },
        };
      }
    case ActionTypes.SET_SELECTED_FRAME:
      if (action instanceof SetSelectedFrameAction) {
        return {
          ...state,
          selectedFrame: payload,
        };
      }
    case ActionTypes.SET_NODE:
      if (action instanceof SetNodeAction) {
        return {
          ...state,
          node: {
            ...state.node,
            tree: payload,
          },
        };
      }
    case ActionTypes.SET_SPLASH_SEEN:
      if (action instanceof SetSplashAction) {
        return {
          ...state,
          splash: false,
        };
      }
    case ActionTypes.RESET_APP_STATE:
      if (action instanceof ResetAppStateAction) {
        return { ...initialState, splash: state.splash };
      }
    default:
      return state;
  }
};
