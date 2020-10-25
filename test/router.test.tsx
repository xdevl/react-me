import React from "react";
import renderer from "react-test-renderer";
import {MePath, MeRoute, MeRouter, MeRouterContext} from "../lib/router";
import assertRendering from "./assert";

const withMock = (location: string, element: JSX.Element) => {
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
    const output = renderer.create(withMock("/secondview/",
        <MeRouter routes={[
            new MeRoute(MePath.then("firstview")).callback(() =>  <h1>First View</h1>),
            new MeRoute(MePath.then("secondview")).callback(() => <h1>Second View</h1>),
            new MeRoute(MePath.then("thirdview")).callback(() => <h1>Third View</h1>),
        ]} />
    )).toJSON() as renderer.ReactTestRendererNode;

    assertRendering(output,
        <h1>Second View</h1>
    );
});

test("Router matches route with params", () => {
    const {str, num} = MePath;
    const output = renderer.create(withMock("/thirdview/123456789/details",
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
    )).toJSON() as renderer.ReactTestRendererNode;

    assertRendering(output,
        <div>
            <h1>details</h1>
            <span>123456789</span>
        </div>
    );
});

test("Router matches not found", () => {
    const {path} = MePath;
    const output = renderer.create(withMock("/abcdef",
        <MeRouter routes={[
            new MeRoute(MePath.then("home")).callback(() => <h1>Welcome</h1>),
            new MeRoute(MePath.then(path("path"))).callback(() => <h1>Not Found</h1>),
        ]} />
    )).toJSON() as renderer.ReactTestRendererNode;

    assertRendering(output,
        <h1>Not Found</h1>
    );
});

test("Router subroutes", () => {
    const {str, path} = MePath;
    const output = renderer.create(withMock("/mainView/subView1/subView2",
        <MeRouter routes={[
            new MeRoute(MePath.then("mainView").then(path("path"))).callback((params) =>
                <MeRouter path={"/" + params.path} routes={[
                    new MeRoute(MePath.then("subView1").then(str("view")))
                        .callback((subparams) => <h1>{subparams.view}</h1>),
                ]} />
            )
        ]} />
    )).toJSON() as renderer.ReactTestRendererNode;

    assertRendering(output,
        <h1>subView2</h1>
    );
});