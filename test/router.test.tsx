import React from "react";
import renderer from "react-test-renderer";
import {MePath, MeRoute, MeRouter, MeRouterContext} from "../lib/router";
import assertRendering from "./assert";

const withMock = (location: string, element: JSX.Element) => {
    return (<MeRouterContext.Provider value={{getLocation: () => location, route: (path) => {}}}>
        {element}
    </MeRouterContext.Provider>);
}

test("Matches simple route", () => {
    const output = renderer.create(withMock("/secondview",
        <MeRouter>
            <MeRoute path={new MePath("firstview")} render={() => 
                <h1>First View</h1>
            }/>
            <MeRoute path={new MePath("secondview")} render={() => 
                <h1>Second View</h1>
            }/>
            <MeRoute path={new MePath("thirdview")} render={() => 
                <h1>Third View</h1>
            }/>
        </MeRouter>
    )).toJSON()!;

    assertRendering(output,
        <h1>Second View</h1>
    );
});

test("Matches route with params", () => {
    const output = renderer.create(withMock("/thirdview/123456789/details/address",
        <MeRouter>
            <MeRoute path={new MePath("firstview")} render={() => 
                <h1>First View</h1>
            }/>
            <MeRoute path={new MePath("secondview")} render={() => 
                <h1>Second View</h1>
            }/>
            <MeRoute path={new MePath("thirdview").thenNum("id").thenStr("view")} render={(params) => 
                <div>
                    <h1>{params.view}</h1>
                    <span>{params.id}</span>
                </div>
            }/>
        </MeRouter>
    )).toJSON()!;

    assertRendering(output,
        <div>
            <h1>details</h1>
            <span>123456789</span>
        </div>
    );
});

test("Matches not found", () => {
    const output = renderer.create(withMock("/",
        <MeRouter>
            <MeRoute path={new MePath("home")} render={() => 
                <h1>Welcome</h1>
            }/>
            <MeRoute path={new MePath().thenSubPath("subPath")} render={() => 
                <h1>Not Found</h1>
            }/>
        </MeRouter>
    )).toJSON()!;

    assertRendering(output,
        <h1>Not Found</h1>
    );
});

test("Subrouting", () => {
    const output = renderer.create(withMock("/mainView/subView1/subView2",
        <MeRouter>
            <MeRoute path={new MePath("mainView").thenSubPath("path")} render={(params) => 
                <MeRouter subPath={params.path}>
                    <MeRoute path={new MePath("subView1").thenStr("view")} render={(subparams) =>
                        <h1>{subparams.view}</h1>
                    }/>
                </MeRouter>
            }/>
        </MeRouter>
    )).toJSON()!;

    assertRendering(output,
        <h1>subView2</h1>
    );
});