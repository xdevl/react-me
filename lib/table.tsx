/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, {ReactElement} from "react";

type Renderer<T> = (value: T, index: number) => string | ReactElement;

interface MeColumn<T> {
  label: string;
  render: Renderer<T>;
}

interface MeTableProps<T> {
  values: T[];
  columns: Array<MeColumn<T>>;
}

export const renderField = <T, >(field: keyof T): Renderer<T> => {
  return (value: T): string => typeof value[field] === "string" ? String(value[field]) : JSON.stringify(value[field]);
};

export const columnsFrom = <T, >(...fields: Array<keyof T>): Array<MeColumn<T>> =>
  fields.map((field) => ({label: String(field), render: renderField(field)}));

export const MeTable = <T, >(props: MeTableProps<T>): JSX.Element => {
  return <Table>
    <TableHead>
      <TableRow>
        {props.columns.map((column, index) => <TableCell key={index}>{column.label}</TableCell>)}
      </TableRow>
    </TableHead>
    <TableBody>
      {props.values.map((value, rowIndex) => (
        <TableRow key={rowIndex}>
          {props.columns.map((column, cellIndex) => <TableCell key={cellIndex}>{column.render(value, rowIndex)}</TableCell>)}
        </TableRow>
      ))}
    </TableBody>
  </Table>;
};
