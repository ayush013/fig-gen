export class Store {
  private _state: IState;
  private _subscriptions: { [key: string]: (state: IState) => void } = {};
  private _reducer: (state: IState, action: IAction<any>) => IState;

  private actionLogger = (action: IAction<any>) => {};

  constructor(
    reducer: (state: IState, action: IAction<any>) => IState,
    enableLogs?: boolean
  ) {
    this._state = reducer(initialState, { type: "@@INIT" });
    this._reducer = reducer;

    enableLogs &&
      (this.actionLogger = (action: IAction<any>) => {
        console.log(action);
      });
  }

  public get state() {
    return this._state;
  }

  public subscribe(key: string, callback: (state: IState) => void) {
    this._subscriptions[key] = callback;

    return {
      unsubscribe: () => {
        delete this._subscriptions[key];
      },
    };
  }

  public dispatch(action: IAction<any>): void {
    this._state = this._reducer(this._state, action);

    this.actionLogger(action);

    Object.keys(this._subscriptions).forEach((key) => {
      this._subscriptions[key](this._state);
    });
  }
}

export interface IState {
  markup: {
    inProgress: boolean;
    error: string | null;
    data: string;
  };
}

export interface IAction<T> {
  type: string;
  payload?: T;
}

export const initialState: IState = {
  markup: { inProgress: false, error: null, data: "" },
};
