import { IAppActions } from "./ActionTypes";
import getStore, { IState } from "./Store";

const store = getStore();

// A Higher order function that converts a Stateless Component to a Stateful Component
// Maps state to props which a component needs to access
// Also adds a reference to dispatcher to the component
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
    store.subscribe(`connectedComponent-${Math.random() * 100000}`, (state) => {
      const updatedState = mapStateToProps(state);
      connectedComponent[connectKey] = {
        ...updatedState,
        dispatch: store.dispatch,
      };
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
