import { FigmaSceneNode } from "../../figma/model";
import { IAppActions } from "./ActionTypes";
import { appReducer } from "./Reducer";

export class Store {
  private _state: IState = initialState;
  private _subscriptions: { [key: string]: (state: IState) => void } = {};
  private _reducer: (state: IState, action: IAppActions) => IState;

  private actionLogger = (action: IAppActions) => {};

  constructor(
    reducer: (state: IState, action: IAppActions) => IState,
    enableLogs?: boolean
  ) {
    this._reducer = reducer;

    enableLogs &&
      (this.actionLogger = (action: IAppActions) => {
        console.log(action, this._state);
      });

    const initAction = { type: "@@INIT" };

    this.dispatch(initAction);
  }

  public get state() {
    return this._state;
  }

  public subscribe(
    key: string,
    callback: (state: IState) => void
  ): Subscription {
    this._subscriptions[key] = callback;
    callback(this._state);

    return {
      unsubscribe: () => {
        delete this._subscriptions[key];
      },
    };
  }

  public dispatch = (action: IAppActions): void => {
    this._state = this._reducer(this._state, action);

    this.actionLogger(action);

    Object.keys(this._subscriptions).forEach((key) => {
      this._subscriptions[key](this._state);
    });
  };
}

let store: Store;

const getStore = (): Store => {
  if (!store) {
    store = new Store(appReducer, true);
  }
  return store;
};

export default getStore;

export interface Subscription {
  unsubscribe: () => void;
}

export interface IState {
  markup: {
    inProgress: boolean;
    error: string | null;
    data: string;
    warnings: string[];
  };
  node: {
    tree: FigmaSceneNode | null;
  };
  selectedFrame: string;
  splash: boolean;
  dialog: IDialogState | null;
}

export interface IDialogState {
  title: string;
  content: string[];
}

export const initialState: IState = {
  markup: {
    inProgress: false,
    error: null,
    data: "",
    warnings: [],
  },
  node: { tree: null },
  selectedFrame: "",
  splash: true,
  dialog: null,
};
