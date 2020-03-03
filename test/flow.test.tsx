import React from "react";
import renderer, {act} from "react-test-renderer";
import {MeFlow} from "../lib/flow";

const clickOn = (component: renderer.ReactTestRenderer, text: string) => {
    act(() => component.root.find((node) => node.children[0] === text).props.onClick());
}

test("Can move to next", () => {
    let result = 0;
    const component = renderer.create(new MeFlow<number>()
        .then<string>((value, next) => <div onClick={() => next(String(value * 2))}>{value}</div>)
        .then<number>((value, next) => <div onClick={() => next(Number(value) + 4)}>{value}</div>)
        .render(6, (value) => result = value));

    clickOn(component, "6");
    clickOn(component, "12");

    expect(result).toBe(16);
}); 

test("Can move to previous", () => {
    let result = 0;

    const component = renderer.create(new MeFlow<number>()
        .then<string>((value, next, previous) => <div onClick={() =>
            value < 10 ? next(String(value * 2)) : previous(value / 2)}>{value}</div>)
        .then<number>((value, _next, previous) => <div onClick={() => previous(Number(value) + 4)}>{value}</div>)
        .render(6, undefined, (value) => result = value));

    clickOn(component, "6");
    clickOn(component, "12");
    clickOn(component, "16");

    expect(result).toBe(8);
});