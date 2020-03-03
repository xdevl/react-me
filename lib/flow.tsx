/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import React, {useState} from "react";

type MeRenderer<A, N, P> = (arg: A, next: (value: N) => void, previous: (value: P) => void) => JSX.Element;

interface MeFlowState {
  index: number;
  value: any;
}

export class MeFlow<A, N = A, P = A> {

  private readonly renderers = [] as Array<MeRenderer<any, any, any>>;

  public then<T>(renderer: MeRenderer<N, T, P>): MeFlow<A, T, N> {
    this.renderers.push(renderer);
    return this as any;
  }

  public render(argument: A, next: ((value: N) => void) = () => undefined,
                previous: ((value: A) => void) = () => undefined): JSX.Element {
    return React.createElement(() => {
      const [state, setState] = useState({index: 0, value: argument} as MeFlowState);
      const update = (updated: MeFlowState, old: MeFlowState): MeFlowState => {
        if (updated.index < 0) {
          previous(updated.value);
        } else if (updated.index >= this.renderers.length) {
          next(updated.value);
        } else {
          return updated;
        }
        return old;
      };

      return this.renderers[state.index](state.value,
        (value) => setState((old) => update({index: old.index + 1, value}, old)),
        (value) => setState((old) => update({index: old.index - 1, value}, old)));
    });
  }
}
