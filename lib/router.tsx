/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
// tslint:disable max-classes-per-file
import React, {FunctionComponent, ReactElement, useContext, useState} from "react";

interface IMeRoute<T> {
  path: MePath<T>;
  render: (params: T) => JSX.Element;
}

export const MeRoute = <T extends {}>(props: IMeRoute<T>) => {
  return null;
};

interface IMeRouter {
  subPath?: string;
}

export const MeRouter: FunctionComponent<IMeRouter> = (props) => {
  const context = useContext(MeRouterContext);
  const location = props.subPath ? props.subPath : context.location;
  const match = React.Children.toArray(props.children).filter(isRoute)
    .find((route) => route.props.path.capture(location) != null);

  if (match) {
    return match ? match.props.render(match.props.path.capture(location)) : null;
  } else {
    return null;
  }
};

function isRoute<T>(node: React.ReactNode): node is ReactElement<IMeRoute<T>> {
  return React.isValidElement(node) && node.type === MeRoute;
}

class MeParam<N extends keyof any, T> {

  constructor(public readonly name: N,
              public readonly converter: (value: string) => T,
              public readonly regex: string) {
  }
}

export class MePath<U = {}> {

    public regex = "^";
    private params = [] as Array<MeParam<any, any>>;

    constructor(param?: string) {
      if (param) {
        this.then(param);
      }
    }

    public then<N extends keyof any, T>(param: MeParam<N, T> | string) {
      if (typeof param === "string") {
        this.regex += `/${param}`;
      } else {
        this.params.push(param);
        this.regex += `/(${param.regex})`;
      }
      return this as unknown as MePath<U & Record<N, T>>;
    }

    public thenStr<N extends keyof any>(name: N, regex = "[^/]+") {
      return this.then(new MeParam(name, (value) => value, regex));
    }

    public thenNum<N extends keyof any>(name: N, regex = "[1-9][0-9]*") {
      return this.then(new MeParam(name, (value) => Number(value), regex));
    }

    public thenSubPath<N extends keyof any>(name: N) {
      const param = new MeParam(name, (value) => value, ".*");
      this.params.push(param);
      this.regex += `(/${param.regex})?`;
      return this as unknown as MePath<U & Record<N, string | undefined>>;
    }

    public capture(url: string): U | null {
        const matches = url.match(new RegExp(this.regex));
        if (matches == null || matches.length !== this.params.length + 1) {
            return null;
        } else {
            return this.params.reduce((result, param, index) => {
              result[param.name] = param.converter(matches[index + 1]);
              return result;
            }, {} as any);
        }
    }
}

interface IMeRouterContext {
    location: string;
    route(path: string): void;
  }

export const MeRouterContext = React.createContext<IMeRouterContext>({
    location: "default location",
    route: (path: string) => {
      throw new Error("Component should be a children of <Router>");
    },
});

const MeRouterContextProvider: FunctionComponent<{}> = (props) => {
    const [location, setLocation] = useState(window.location.pathname);

    window.onpopstate = () => setLocation(window.location.pathname);

    return (<MeRouterContext.Provider value={{
      location,
      route: (path: string) => {
        history.pushState({}, "", path);
        setLocation(window.location.pathname);
      },
    }}>
      {props.children}
    </MeRouterContext.Provider>);
};

export const withMeRouter = (element: JSX.Element) => <MeRouterContextProvider>{element}</MeRouterContextProvider>;
