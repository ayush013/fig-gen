import { FigmaSceneNode } from "../../figma/model";
import { IDialogState } from "./Store";

const ActionTypes = {
  SET_MARKUP: "SET_MARKUP",
  SET_IN_PROGRESS: "SET_IN_PROGRESS",
  SET_ERROR: "SET_ERROR",
  SET_SELECTED_FRAME: "SET_SELECTED_FRAME",
  RESET_APP_STATE: "RESET_APP_STATE",
  SET_NODE: "SET_NODE",
  SET_SPLASH_SEEN: "SET_SPLASH_SEEN",
  ADD_WARNING: "ADD_WARNING",
  CLEAR_ALL_WARNINGS: "CLEAR_ALL_WARNINGS",
  SET_AND_OPEN_DIALOG: "SET_AND_OPEN_DIALOG",
  CLOSE_DIALOG: "CLOSE_DIALOG",
};

export default ActionTypes;

export class SetMarkupAction {
  type: string;
  constructor(public payload: string) {
    this.type = ActionTypes.SET_MARKUP;
    this.payload = payload;
  }
}

export class SetInProgressAction {
  type: string;
  constructor() {
    this.type = ActionTypes.SET_IN_PROGRESS;
  }
}

export class SetErrorAction {
  type: string;
  constructor(public payload: string) {
    this.type = ActionTypes.SET_ERROR;
    this.payload = payload;
  }
}

export class SetSelectedFrameAction {
  type: string;
  constructor(public payload: string) {
    this.type = ActionTypes.SET_SELECTED_FRAME;
    this.payload = payload;
  }
}

export class ResetAppStateAction {
  type: string;
  constructor() {
    this.type = ActionTypes.RESET_APP_STATE;
  }
}

export class SetNodeAction {
  type: string;
  constructor(public payload: FigmaSceneNode) {
    this.type = ActionTypes.SET_NODE;
    this.payload = payload;
  }
}

export class SetSplashAction {
  type: string;
  constructor() {
    this.type = ActionTypes.SET_SPLASH_SEEN;
  }
}

export class SetWarningAction {
  type: string;
  constructor(public payload: string) {
    this.type = ActionTypes.ADD_WARNING;
    this.payload = payload;
  }
}

export class ClearAllWarningsAction {
  type: string;
  constructor() {
    this.type = ActionTypes.CLEAR_ALL_WARNINGS;
  }
}

export class OpenDialogAction {
  type: string;
  constructor(public payload: IDialogState) {
    this.type = ActionTypes.SET_AND_OPEN_DIALOG;
    this.payload = payload;
  }
}

export class CloseDialogAction {
  type: string;
  constructor() {
    this.type = ActionTypes.CLOSE_DIALOG;
  }
}

export type IAppActions =
  | SetMarkupAction
  | SetInProgressAction
  | SetErrorAction
  | SetSelectedFrameAction
  | ResetAppStateAction
  | SetNodeAction
  | SetSplashAction
  | SetWarningAction
  | ClearAllWarningsAction;
