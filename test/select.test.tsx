/**
 * @jest-environment jsdom
 */
import React from "react";
import { MeMultipleSelect, MeSingleSelect } from "../lib/select";
import {findByText, getByRole} from '@testing-library/dom'
import {render} from '@testing-library/react'
import userEvent from "@testing-library/user-event";

const clickOn = async (text: string, container = document.body) => {
    userEvent.click(await findByText(container, text));
}
const clickOnOption = async (option: string) => clickOn(option, getByRole(document.body, "listbox"));

test("Can select single", async () => {
    let selected = "";
    const options = ["one", "two", "three"];
    render(<MeSingleSelect options={options} value="three" getKey={(v) => v}
            getLabel={(v) => v} onChange={(value) => selected = value} />);
    
    await clickOn("three");
    await clickOnOption("two");

    expect(selected).toBe("two");
});

test("Can select single not in options", async () => {
    let selected = "";
    const options = ["one", "two", "three"];
    render(<MeSingleSelect options={options} value="hello" getKey={(v) => v}
            getLabel={(v) => v} onChange={(value) => selected = value} />);
    
    await clickOn("hello");
    await clickOnOption("hello", );

    expect(selected).toBe("hello");
});

test("Can select multiple", async () => {
    let selected = ["one"];
    const options = ["one", "two", "three"];
    render(<MeMultipleSelect options={options} value={selected} getKey={(v) => v} 
        getLabel={(v) => v} onChange={(values) => selected = values} />);
    
    await clickOn("one");
    await clickOnOption("three");

    expect(selected).toStrictEqual(["one", "three"]);
});

test("Can select multiple not in options", async () => {
    let selected = ["zero",  "two", "four"];
    const options = ["one", "two", "three"];
    render(<MeMultipleSelect options={options} value={selected} getKey={(v) => v} 
        getLabel={(v) => v} onChange={(values) => selected = values} />);
    
    await clickOn("zero");
    await clickOnOption("zero");

    expect(selected).toStrictEqual(["two", "four"]);
});