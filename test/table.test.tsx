import React from "react";
import renderer from "react-test-renderer";
import { columnsFrom, renderField, MeTable } from "../lib/table";
import assertRendering from "./assert";

test("MeTable renders", () => {
  const data = [
    { first: 1, second: "first row", third: true, fourth: 10.1 },
    { first: 2, second: "second row", third: false, fourth: 22.2 },
    { first: 3, second: "third row", third: true, fourth: 30.3 },
  ];

  const output = renderer.create(
      <MeTable values={data} columns={columnsFrom("first", "second", "third", "fourth")} />
    ).toJSON() as renderer.ReactTestRendererNode;

  assertRendering(output,
    <table>
      <thead><tr><th>first</th><th>second</th><th>third</th><th>fourth</th></tr></thead>
      <tbody>
      <tr><td>1</td><td>first row</td><td>true</td><td>10.1</td></tr>
      <tr><td>2</td><td>second row</td><td>false</td><td>22.2</td></tr>
      <tr><td>3</td><td>third row</td><td>true</td><td>30.3</td></tr>
      </tbody>
    </table>,
  );
});

test("MeTable custom rendering", () => {
  const data = [
    { first: 1, second: "first row", third: true, fourth: 10.1 },
    { first: 2, second: "second row", third: false, fourth: 22.2 },
    { first: 3, second: "third row", third: true, fourth: 30.3 },
  ];

  const output = renderer.create(
    <MeTable values={data} columns={[
      {label: "Column #1", render: renderField("first")},
      {label: "Column #2", render: (value) => `"${value.second}"`},
      {label: "Column #3", render: renderField("third")},
      {label: "Column #4", render: (value) => <b>{value.fourth}</b>}
    ]} />).toJSON() as renderer.ReactTestRendererNode;

  assertRendering(output,
    <table>
      <thead><tr><th>Column #1</th><th>Column #2</th><th>Column #3</th><th>Column #4</th></tr></thead>
      <tbody>
      <tr><td>1</td><td>"first row"</td><td>true</td><td><b>10.1</b></td></tr>
      <tr><td>2</td><td>"second row"</td><td>false</td><td><b>22.2</b></td></tr>
      <tr><td>3</td><td>"third row"</td><td>true</td><td><b>30.3</b></td></tr>
      </tbody>
    </table>,
  );
});
