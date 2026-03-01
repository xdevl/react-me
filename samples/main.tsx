/*
 * Copyright (c) 2026 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import React from "react";
import ReactDOM from "react-dom";
import { columnsFrom, MeTable, renderField } from "../lib/table";
import { MeFlex } from "../lib/layout";

const Main = (): JSX.Element => {
  return <div>
    <h1>Horizontal Flex</h1>
    <HorizontalFlexSample />
    <h1>Vertical Flex</h1>
    <VerticalFlexSample />
    <h1>Table</h1>
    <TableSample />
  </div>
}

const HorizontalFlexSample = (): JSX.Element => {
  return <MeFlex flexDirection="row" alignItems="center" flexGap="0.4em" style={{borderStyle: "solid"}}>
    <div style={{width: 200, height: 100, backgroundColor: "red"}}></div>
    <div style={{width: 200, height: 100, backgroundColor: "green"}}></div>
    <div style={{width: 200, height: 100, backgroundColor: "blue"}}></div>
  </MeFlex>
}

const VerticalFlexSample = (): JSX.Element => {
  return <MeFlex flexDirection="column" alignItems="center" flexGap="0.4em" style={{borderStyle: "solid"}}>
    <div style={{width: 200, height: 100, backgroundColor: "red"}}></div>
    <div style={{width: 200, height: 100, backgroundColor: "green"}}></div>
    <div style={{width: 200, height: 100, backgroundColor: "blue"}}></div>
  </MeFlex>
}

const TableSample = (): JSX.Element => {
    const people = [
      { name: "Nannie", surname: "Reid", age: 23 },
      { name: "Ernest", surname: "Avila", age: 64 },
      { name: "Elwood", surname: "Harding", age: 32 },
    ];

  return <MeTable values={people} columns={[
    {label: "Full Name", render: (person, index) => <span> #{index}: {person.name} {person.surname}</span>},
    {label: "Age", render: renderField("age")},
  ]} />
}

ReactDOM.render(<Main />, document.querySelector("#root"));
