import React from "react";
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import {MePath, MeRoute, MeRouter, MeRouterContext} from "../lib/router";

const withMock = (location: string, element: React.JSX.Element) => {
    return (<MeRouterContext.Provider value={{getLocation: () => location, route: (path) => {}}}>
        {element}
    </MeRouterContext.Provider>);
}

test("Route can capture", () => {
    const {str, num} = MePath;
    const params = new MeRoute(MePath.then("view").then(str("type")), num("id"))
        .capture("/view/car/123456");

    expect(params!!.type).toEqual("car");
    expect(params!!.id).toEqual(123456);
});

test("Route captures with missing optional param", () => {
    const {str, num} = MePath;
    const params = new MeRoute(MePath.then("view").then(str("type")), num("id"))
        .capture("/view/car");

    expect(params!!.type).toEqual("car");
    expect(params!!.id).toBeUndefined();
});

test("Route formats", () => {
    const {str, num} = MePath;
    const value = new MeRoute(MePath.then("view").then(str("type")), num("id"))
        .format({type: "truck"}, {id: 1989});

    expect(value).toEqual("/view/truck/1989");
});

test("Route formats with missing optional param", () => {
    const {str, num} = MePath;
    const value = new MeRoute(MePath.then("view").then(str("type")), num("id"))
        .format({type: "truck"});

    expect(value).toEqual("/view/truck");
});

test("Router matches simple route", () => {
    render(withMock("/secondview/",
        <MeRouter routes={[
            new MeRoute(MePath.then("firstview")).callback(() =>  <h1>First View</h1>),
            new MeRoute(MePath.then("secondview")).callback(() => <h1>Second View</h1>),
            new MeRoute(MePath.then("thirdview")).callback(() => <h1>Third View</h1>),
        ]} />
    ));

    expect(screen.getByRole('heading')).toHaveTextContent('Second View')
});

test("Router matches route with params", () => {
    const {str, num} = MePath;
    const rendering = render(withMock("/thirdview/123456789/details",
        <MeRouter routes={[
            new MeRoute(MePath.then("firstview")).callback(() => <h1>First View</h1>),
            new MeRoute(MePath.then("secondview")).callback(() => <h1>Second View</h1>),
            new MeRoute(MePath.then("thirdview").then(num("id")).then(str("view"))).callback((params) =>
                <div>
                    <h1>{params.view}</h1>
                    <span>{params.id}</span>
                </div>
            ),
        ]} />
    ));

    expect(rendering.container).toMatchSnapshot();
});

test("Router matches not found", () => {
    const {path} = MePath;
    render(withMock("/abcdef",
        <MeRouter routes={[
            new MeRoute(MePath.then("home")).callback(() => <h1>Welcome</h1>),
            new MeRoute(MePath.then(path("path"))).callback(() => <h1>Not Found</h1>),
        ]} />
    ));

    expect(screen.getByRole('heading')).toHaveTextContent('Not Found');
});

test("Router subroutes", () => {
    const {str, path} = MePath;
    render(withMock("/mainView/subView1/subView2",
        <MeRouter routes={[
            new MeRoute(MePath.then("mainView").then(path("path"))).callback((params) =>
                <MeRouter path={"/" + params.path} routes={[
                    new MeRoute(MePath.then("subView1").then(str("view")))
                        .callback((subparams) => <h1>{subparams.view}</h1>),
                ]} />
            )
        ]} />
    ));

    expect(screen.getByRole('heading')).toHaveTextContent('subView2');
});