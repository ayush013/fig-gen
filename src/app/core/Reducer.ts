import ActionTypes, {
  IAppActions,
  ClearAllWarningsAction,
  ResetAppStateAction,
  SetErrorAction,
  SetInProgressAction,
  SetMarkupAction,
  SetNodeAction,
  SetSelectedFrameAction,
  SetSplashAction,
  SetWarningAction,
  OpenDialogAction,
  CloseDialogAction,
} from "./ActionTypes";
import { IState, initialState } from "./Store";

export const appReducer = (
  state: IState = initialState,
  action: IAppActions
): IState => {
  const { type } = action;

  switch (type) {
    case ActionTypes.SET_MARKUP:
      if (action instanceof SetMarkupAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            error: null,
            data: action.payload,
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
            error: action.payload,
            inProgress: false,
          },
        };
      }
    case ActionTypes.SET_SELECTED_FRAME:
      if (action instanceof SetSelectedFrameAction) {
        return {
          ...state,
          selectedFrame: action.payload,
        };
      }
    case ActionTypes.SET_NODE:
      if (action instanceof SetNodeAction) {
        return {
          ...state,
          node: {
            ...state.node,
            tree: action.payload,
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
    case ActionTypes.ADD_WARNING:
      if (action instanceof SetWarningAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            warnings: [...state.markup.warnings, action.payload],
          },
        };
      }
    case ActionTypes.CLEAR_ALL_WARNINGS:
      if (action instanceof ClearAllWarningsAction) {
        return {
          ...state,
          markup: {
            ...state.markup,
            warnings: [],
          },
        };
      }
    case ActionTypes.SET_AND_OPEN_DIALOG:
      if (action instanceof OpenDialogAction) {
        return {
          ...state,
          dialog: action.payload,
        };
      }
    case ActionTypes.CLOSE_DIALOG:
      if (action instanceof CloseDialogAction) {
        return {
          ...state,
          dialog: null,
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
