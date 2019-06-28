import React from "react";
import renderer from "react-test-renderer";
import { MeColumn, MeTable } from "../lib/table";
import assertRendering from "./assert";

test("MeTable renders", () => {
  const data = [
    { first: 1, second: "first row", third: true, four: 10.1 },
    { first: 2, second: "second row", third: false, four: 22.2 },
    { first: 3, second: "third row", third: true, four: 30.3 },
  ];

  const output = renderer.create(
    <MeTable values={data}>
      <MeColumn label="Column #1" field="first" />
      <MeColumn label="Column #2" field="second" />
      <MeColumn label="Column #3" field="third" />
      <MeColumn label="Column #4" field="four" />
    </MeTable>,
  ).toJSON()!;

  assertRendering(output,
    <table>
      <thead><tr><th>Column #1</th><th>Column #2</th><th>Column #3</th><th>Column #4</th></tr></thead>
      <tbody>
      <tr><td>1</td><td>first row</td><td>true</td><td>10.1</td></tr>
      <tr><td>2</td><td>second row</td><td>false</td><td>22.2</td></tr>
      <tr><td>3</td><td>third row</td><td>true</td><td>30.3</td></tr>
      </tbody>
    </table>,
  );
});

test("MeTable overrides", () => {
  const data = [
    { first: 1, second: "first row", third: true, four: 10.1 },
    { first: 2, second: "second row", third: false, four: 22.2 },
    { first: 3, second: "third row", third: true, four: 30.3 },
  ];

  const output = renderer.create(
    <MeTable values={data}>
      <MeColumn label="Column #1" field="first" />
      <MeColumn label="Column #2" field="second" render={(value) => `"${value}"`} />
      <MeColumn label="Column #3" field="third" />
      <MeColumn label="Column #4" field="four" render={(value) =>
        <b>{value}</b>
      }/>
    </MeTable>,
  ).toJSON()!;

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
