/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, {ReactElement} from "react";

type Renderer<T> = (value: T) => string | ReactElement;

interface IMeColumn<T> {
  label: string;
  render: Renderer<T>;
}

interface IMeTable<T> {
  values: T[];
  columns: Array<IMeColumn<T>>;
}

export const renderField = <T, >(field: keyof T): Renderer<T> => {
  return (value: T) => typeof value[field] === "string" ? String(value[field]) : JSON.stringify(value[field]);
};

export const columnsFrom = <T, >(...fields: Array<keyof T>): Array<IMeColumn<T>> =>
  fields.map((field) => ({label: String(field), render: renderField(field)}));

export const MeTable = <T, >(props: IMeTable<T>) => {
  return <Table>
    <TableHead>
      <TableRow>
        {props.columns.map((column) => <TableCell>{column.label}</TableCell>)}
      </TableRow>
    </TableHead>
    <TableBody>
      {props.values.map((value) => (
        <TableRow>
          {props.columns.map((column) => <TableCell>{column.render(value)}</TableCell>)}
        </TableRow>
      ))}
    </TableBody>
  </Table>;
};
