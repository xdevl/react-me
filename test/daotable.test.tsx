import React from "react";
import renderer from "react-test-renderer";
import { DaoColumn, DaoTable, ReflectiveDaoTable } from "../lib/daotable";
import assertRendering from "./assert";

test("DaoTable renders", () => {
  const data = [
    { first: 1, second: "first row", third: true },
    { first: 2, second: "second row", third: false },
    { first: 3, second: "third row", third: true },
  ];

  const output = renderer.create(
    <DaoTable values={data}>
      <DaoColumn label="Column #1" field="first" />
      <DaoColumn label="Column #2" field="second" />
      <DaoColumn label="Column #3" field="third" />
    </DaoTable>,
  ).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>Column #1</th><th>Column #2</th><th>Column #3</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>first row</td><td>true</td></tr>
        <tr><td>2</td><td>second row</td><td>false</td></tr>
        <tr><td>3</td><td>third row</td><td>true</td></tr>
      </tbody>
    </table>,
  );
});

test("ReflectiveDaoTable renders", () => {
  const data = [
    { first: 1, second: "first row", third: true, four: 10.1 },
    { first: 2, second: "second row", third: false, four: 22.2 },
    { first: 3, second: "third row", third: true, four: 30.3 },
  ];

  const output = renderer.create(<ReflectiveDaoTable values={data} />).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>first</th><th>second</th><th>third</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>first row</td><td>true</td><td>10.1</td></tr>
        <tr><td>2</td><td>second row</td><td>false</td><td>22.2</td></tr>
        <tr><td>3</td><td>third row</td><td>true</td><td>30.3</td></tr>
      </tbody>
    </table>,
  );
});
