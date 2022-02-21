import { IAppActions } from "./ActionTypes";
import getStore, { IState } from "./Store";

const store = getStore();

export default function connect(
  mapStateToProps: (store: IState) => Record<string, any>
) {
  return (Component: Function) => {
    const componentState = mapStateToProps(store.state);
    const connectedComponent = Object.assign(Component, {
      [connectKey]: {
        ...componentState,
        dispatch: store.dispatch,
      },
    });
    return connectedComponent;
  };
}

export const connectKey = Symbol("connect");

export interface IConnectedComponent {
  [connectKey]: IProps<any> & IDispatch;
}

export type IDispatch = {
  dispatch: (action: IAppActions) => void;
};

export type IProps<T> = {
  [K in keyof T]: T[K];
};
