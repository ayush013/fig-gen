import getStore, { IAction } from "./Store";

const store = getStore();

export default function connect(state: Function) {
  return function (Component: Function) {
    const connectedComponent = Object.assign(Component, {
      [connectKey]: {
        ...state(store.state),
        dispatch: store.dispatch,
      },
    });
    return connectedComponent;
  };
}

export const connectKey = Symbol("connect");

export interface IConnectedComponent {
  [connectKey]: IProps<any>;
}

export type IDispatch = {
  dispatch?: (action: IAction<any>) => void;
};

export type IProps<T> = {
  [K in keyof T]: T[K];
};
