/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
// tslint:disable max-classes-per-file
import React, {FunctionComponent, useContext, useState} from "react";

export interface IMePath<P> {
  deserialize(values: string[], offset: number): P;
  serialize(param: P): string;
  getRegex(): string;
  toString(): string;
}

export class MeSegment<N extends keyof any, T> implements IMePath<Record<N, T>> {

  public readonly capture: boolean;

  constructor(public readonly name: N,
              public readonly converter: (value: string) => T,
              public readonly regex: string) {
    this.capture = name !== regex;
  }

  public deserialize(values: string[], offset: number): Record<N, T> {
    return this.capture && values[offset] !== undefined ? {[this.name]: this.converter(values[offset])} : {} as any;
  }

  public serialize(value: Record<N, T>) {
    return this.capture ? `/${value[this.name]}` : `/${this.regex}`;
  }

  public getRegex() {
    return this.capture ? `/(${this.regex})` : `/${this.regex}`;
  }

  public toString() {
    return this.capture ? `/:${this.name}` : `/${this.regex}`;
  }
}

export class MePath<P = {}> implements IMePath<P> {

  public static readonly none: IMePath<{}> = {
    deserialize: () => ({}),
    getRegex: () => "",
    serialize: () => "",
    toString: () => "",
  };

  public static readonly num = <N extends keyof any>(name: N, regex?: string) =>
    new MeSegment(name, (value) => Number(value), regex || "[1-9][0-9]*")

  public static readonly str = <N extends keyof any>(name: N, regex?: string) =>
    new MeSegment(name, (value) => value, regex || "[^/]+")

  public static readonly path = <N extends keyof any>(name: N) => MePath.str(name, ".*");

  public static readonly then = <T, >(param: IMePath<T> | string) => new MePath().then(param);

  private readonly paths = [] as Array<IMePath<any>>;

  public deserialize(values: string[], offset: number): P {
    return this.paths.reduce((result, path) =>
      Object.assign(result, path.deserialize(values, offset + Object.keys(result).length))
    , {} as any);
  }

  public serialize(param: P): string {
    return this.paths.reduce((buff, path) => buff + path.serialize(param), "");
  }

  public getRegex(): string {
    return this.paths.reduce((buff, path) => buff + path.getRegex(), "");
  }

  public toString(): string {
    return this.paths.reduce((buff, path) => buff + path.toString(), "");
  }

  public then<T>(param: IMePath<T> | string): T extends string ? MePath<T> : MePath<P & T> {
    this.paths.push(typeof param === "string" ? new MeSegment(param, (value) => value, param) : param);
    return this as any;
  }
}

export type RouteRenderer<MP, OP> = [MeRoute<MP, OP>, (params: MP & Partial<OP>) => JSX.Element];

export class MeRoute<MP, OP = {}> {
  private readonly regex: RegExp;
  constructor(private readonly mandatory: IMePath<MP>, private readonly optional = MePath.none as IMePath<OP>) {
    this.regex = new RegExp(`^${this.mandatory.getRegex()}(?:${this.optional.getRegex()})?$`);
  }

  public capture(url: string): MP & Partial<OP> | null {
    const matches = url.match(this.regex);
    if (matches) {
      const mandatory = this.mandatory.deserialize(matches, 1);
      const optional = this.optional.deserialize(matches, 1 + Object.keys(mandatory).length);
      return {...mandatory, ...optional};
    } else {
      return null;
    }
  }

  public format(mandatory: MP, optional?: OP) {
    return this.mandatory.serialize(mandatory) + (optional ? this.optional.serialize(optional) : "");
  }

  public callback(value: (params: MP & Partial<OP>) => JSX.Element) {
    return [this, value] as RouteRenderer<MP, OP>;
  }

  public toString(): string {
    return this.mandatory.toString() + this.optional.toString();
  }
}

export interface IMeRouter {
  path?: string;
  routes: Array<RouteRenderer<any, any>>;
}

export const MeRouter: FunctionComponent<IMeRouter> = (props) => {
  const context = useContext(MeRouterContext);
  const strip = (value: string) => value.endsWith("/") ? value.substr(0, value.length - 1) : value;
  const location = strip(props.path ?? context.getLocation());
  for (const [route, renderer] of props.routes) {
    const match = route.capture(location);
    if (match) {
      return renderer(match);
    }
  }
  return null;
};

interface IMeRouterContext {
  getLocation(): string;
  route(path: string): void;
}

export const MeRouterContext = React.createContext<IMeRouterContext>({
    getLocation: () => window.location.pathname,
    route: (path: string) => {
      throw new Error("Component should be a children of <Router>");
    },
});

const MeRouterContextProvider: FunctionComponent<{}> = (props) => {
    const [render, setRender] = useState(0);
    const forceUpdate = () => setRender((accumulator) => accumulator + 1);

    window.onpopstate = forceUpdate;

    return (<MeRouterContext.Provider value={{
      getLocation: () => window.location.pathname,
      route: (path: string) => {
        if (path !== window.location.pathname) {
          history.pushState({}, "", path);
        }
        forceUpdate();
      },
    }}>
      {props.children}
    </MeRouterContext.Provider>);
};

export const withMeRouter = (element: JSX.Element) => <MeRouterContextProvider>{element}</MeRouterContextProvider>;
