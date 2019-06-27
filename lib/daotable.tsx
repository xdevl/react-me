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
import React, {FunctionComponent, ReactElement} from "react";
import ReactDOM from "react-dom";

export type Renderer = (value: any) => string | ReactElement;

interface IDaoColumn {
  field: string;
  label?: string;
  render?: Renderer;
}

export const DaoColumn = (props: IDaoColumn) => <span />;

interface IDaoTable {
  values: any[];
}

export const DaoTable: FunctionComponent<IDaoTable> = (props) => {
  const format = (value: any) => typeof value === "string" ? value : JSON.stringify(value);
  const render = (renderer: Renderer | undefined, value: any) => renderer ? renderer(value) : format(value);

  return <Table>
    <TableHead>
      <TableRow>
        {React.Children.map(props.children, (child, index) => (
          isDaoColumn(child) && <TableCell>{child.props.label || child.props.field}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {props.values.map((value) => (
        <TableRow>
          {React.Children.map(props.children, (child, index) => (
            isDaoColumn(child) && <TableCell>{render(child.props.render, value[child.props.field])}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>;
};

export const ReflectiveDaoTable: FunctionComponent<IDaoTable> = (props) => {
  const addAll = <T extends {}>(set: Set<T>, ...values: T[]) => values.reduce((res, value) => res.add(value), set);
  const columns: Set<string> = props.values.reduce((set, value) => addAll(set, ...Object.keys(value)), new Set());

  const override = new Map(React.Children.toArray(props.children)
    .filter(isDaoColumn)
    .map((child) => [child.props.field, child]));

  return <DaoTable values={props.values}>
    {Array.from(columns.keys()).map((column) =>
      override.has(column) ? override.get(column) : <DaoColumn field={column} />,
    )}
  </DaoTable>;
};

function isDaoColumn(node: React.ReactNode): node is ReactElement<IDaoColumn> {
  return React.isValidElement(node) && node.type === DaoColumn;
}
