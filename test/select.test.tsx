/**
 * @jest-environment jsdom
 */
import React, {useState} from "react";
import { MeSelect } from "../lib/select";
import {findAllByRole, findByRole, findByTestId, findByText} from '@testing-library/dom'
import {render} from '@testing-library/react'
import userEvent from "@testing-library/user-event";

const STATE_ID = "state";

const findState = async () => findByTestId(document.body, STATE_ID)
    .then((state) => state.textContent ? JSON.parse(state.textContent) : undefined);

const TestComponent = <T,>(props: {value: T, render: (value: T, callback: (arg: T) => void) => React.ReactNode}) => {
    const [state, setState] = useState(props.value);
    return <React.Fragment>
        {props.render(state, setState)}
        <span data-testid={STATE_ID}>{JSON.stringify(state)}</span>
    </React.Fragment>;
};

const clickOn = async (text: string, container = document.body) => findByText(container, text)
    .then((view) => userEvent.click(view));

const findListContainer = async () => findByRole(document.body, "listbox");

const clickOnOption = async (option: string) => findListContainer()
    .then((listbox) => clickOn(option, listbox));

const findOptions = async () => findListContainer()
    .then((list) => findAllByRole(list, "option"))
    .then((options) => options.map((node) => node.textContent));

test("Display no options", async () => {
    const noValueLabel = "select something!";
    const noOptionLabel = "nothing to select from :'(";
    render(<TestComponent value={undefined} render={(value) => 
        <MeSelect optional value={value} options={[] as string[]} getKey={(v) => v} getLabel={(v) => v}
            onChange={() => undefined} displayEmpty noValueLabel={noValueLabel} noOptionLabel={noOptionLabel} />
    }/>);
    
    await clickOn(noValueLabel);
    expect(await findOptions()).toStrictEqual([noOptionLabel]);
});

test("Select single", async () => {
    const options = ["one", "two", "three"];
    render(<TestComponent value="three" render={(value, onChange) => 
        <MeSelect options={options} value={value} getKey={(v) => v} getLabel={(v) => v} onChange={onChange} />
    }/>);

    await clickOn("three");
    expect(await findOptions()).toStrictEqual(options);

    await clickOnOption("two");
    expect(await findState()).toBe("two");
});


test("Select single not in options", async () => {
    const options = ["one", "two", "three"];
    render(<TestComponent value="hello" render={(value, onChange) => 
        <MeSelect options={options} value={value} getKey={(v) => v} getLabel={(v) => v} onChange={onChange} />
    }/>);
    
    await clickOn("hello");
    expect(await findOptions()).toStrictEqual(options.concat("hello"));

    await clickOnOption("one");
    expect(await findState()).toBe("one");

    await clickOn("one");
    expect(await findOptions()).toStrictEqual(options);
});

test("Unselect optional value", async () => {
    const noValueLabel = "No value";
    const options = ["one", "two", "three"];
    render(<TestComponent value={undefined as string|undefined} render={(value, onChange) => 
        <MeSelect optional displayEmpty noValueLabel={noValueLabel} options={options} value={value}
            getKey={(v) => v} getLabel={(v) => v} onChange={onChange} />
    }/>);

    await clickOn(noValueLabel);
    expect(await findOptions()).toStrictEqual([noValueLabel].concat(options));

    await clickOnOption("three");
    expect(await findState()).toBe("three");

    await clickOn("three");
    await clickOnOption(noValueLabel);
    expect(await findState()).toBe(undefined);
})

test("Select multiple", async () => {
    const options = ["one", "two", "three"];
    render(<TestComponent value={["one"]} render={(value, onChange) => 
        <MeSelect multiple options={options} value={value} getKey={(v) => v} getLabel={(v) => v} onChange={onChange} />
    }/>);
    
    await clickOn("one");
    expect(await findOptions()).toStrictEqual(options);

    await clickOnOption("three");
    expect(await findState()).toStrictEqual(["one", "three"]);
});

test("Select multiple not in options", async () => {
    const options = ["one", "two", "three"];
    render(<TestComponent value={["zero", "two", "four"]} render={(value, onChange) =>
        <MeSelect multiple options={options} value={value} getKey={(v) => v} getLabel={(v) => v} onChange={onChange} />
    }/>);
    
    await clickOn("zero");
    expect(await findOptions()).toStrictEqual(options.concat("zero", "four"));

    await clickOnOption("zero");
    expect(await findState()).toStrictEqual(["two", "four"]);
});

test("Display no options", async () => {
    const noValueLabel = "select something!";
    const noOptionLabel = "nothing to select from :'(";
    
    render(<TestComponent value={undefined as string|undefined} render={(value, onChange) => 
        <MeSelect optional value={value} options={[] as string[]} getKey={(v) => v} getLabel={(v) => v}
            onChange={onChange} displayEmpty noValueLabel={noValueLabel} noOptionLabel={noOptionLabel} />
    }/>);
    
    await clickOn(noValueLabel);
    expect(await findOptions()).toStrictEqual([noOptionLabel]);
});