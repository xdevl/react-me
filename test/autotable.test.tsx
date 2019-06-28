import React from "react";
import renderer from "react-test-renderer";
import { MeColumn, MeAutoTable } from "../lib/table";
import assertRendering from "./assert";

test("MeAutoTable renders", () => {
  const data = [
    { first: 1, second: "first row", third: true, four: 10.1 },
    { first: 2, second: "second row", third: false, four: 22.2 },
    { first: 3, second: "third row", third: true, four: 30.3 },
  ];

  const output = renderer.create(<MeAutoTable values={data} />).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>first</th><th>second</th><th>third</th><th>four</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>first row</td><td>true</td><td>10.1</td></tr>
        <tr><td>2</td><td>second row</td><td>false</td><td>22.2</td></tr>
        <tr><td>3</td><td>third row</td><td>true</td><td>30.3</td></tr>
      </tbody>
    </table>,
  );
});

test("MeAutoTable overrides", () => {
  const data = [
    { first: 1, second: "first row", third: true, four: 10.1 },
    { first: 2, second: "second row", third: false, four: 22.2 },
    { first: 3, second: "third row", third: true, four: 30.3 },
  ];

  const output = renderer.create(
    <MeAutoTable values={data}>
      <MeColumn label="Column #1" field="first" render={(value) => `${value * value}`}/>
      <MeColumn label="Column #3" field="third" render={(value) =>
          <span><i>{value ? "true" : "false"}</i></span>
      }/>
    </MeAutoTable>
  ).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>Column #1</th><th>second</th><th>Column #3</th><th>four</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>first row</td><td><span><i>true</i></span></td><td>10.1</td></tr>
        <tr><td>4</td><td>second row</td><td><span><i>false</i></span></td><td>22.2</td></tr>
        <tr><td>9</td><td>third row</td><td><span><i>true</i></span></td><td>30.3</td></tr>
      </tbody>
    </table>,
  );
});

test("MeAutoTable merges all columns", () => {
  const data = [
    { first: 1, second: "first row"},
    { first: 2, third: false, four: 22.2 },
    { second: "third row", third: true },
  ];

  const output = renderer.create(<MeAutoTable values={data} />).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>first</th><th>second</th><th>third</th><th>four</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>first row</td><td></td><td></td></tr>
        <tr><td>2</td><td></td><td>false</td><td>22.2</td></tr>
        <tr><td></td><td>third row</td><td>true</td><td></td></tr>
      </tbody>
    </table>,
  );
});
