import React from "react";
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import {MeFlow} from "../lib/flow";

test("Can move to next", async () => {
    let result = 0;
    render(new MeFlow<number>()
        .then<string>((value, next) => <div onClick={() => next(String(value * 2))}>{value}</div>)
        .then<number>((value, next) => <div onClick={() => next(Number(value) + 4)}>{value}</div>)
        .render(6, (value) => result = value));

    await userEvent.click(screen.getByText("6"));
    await userEvent.click(screen.getByText("12"));

    expect(result).toBe(16);
}); 

test("Can move to previous", async () => {
    let result = 0;

    render(new MeFlow<number>()
        .then<string>((value, next, previous) => <div onClick={() =>
            value < 10 ? next(String(value * 2)) : previous(value / 2)}>{value}</div>)
        .then<number>((value, _next, previous) => <div onClick={() => previous(Number(value) + 4)}>{value}</div>)
        .render(6, undefined, (value) => result = value));

    await userEvent.click(screen.getByText("6"));
    await userEvent.click(screen.getByText("12"));
    await userEvent.click(screen.getByText("16"));

    expect(result).toBe(8);
});