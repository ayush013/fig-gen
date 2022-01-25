import getStore from "./Store";

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

// to do: Fix type
export interface IProps<T> {
  dispatch: Function;
  T: T;
}
