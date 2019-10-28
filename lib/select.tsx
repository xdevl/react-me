/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";

const defaultEmptyMessage = "Select...";

interface ISingleSelect<T> {
    options: T[];
    value: T;
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    onChange: (item: T) => void;
    fullWidth?: boolean;
    emptyMessage?: string;
}

export const SingleSelect = <T, >(props: ISingleSelect<T>) => {
    const map = new Map(props.options.map((option) => [props.getKey(option), option]));

    return <Select value={props.getKey(props.value)} displayEmpty fullWidth={props.fullWidth}
            onChange={(event) => props.onChange(map.get(event.target.value as string)!)}>
        <MenuItem value={undefined} disabled>{props.emptyMessage || defaultEmptyMessage}</MenuItem>
        {props.options.map((option) => (
            <MenuItem key={props.getKey(option)} value={props.getKey(option)}>
                {props.getLabel(option)}
            </MenuItem>
        ))}
    </Select>;
};

interface IMultipleSelect<T> {
    options: T[];
    value: T[];
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    onChange: (item: T[]) => void;
    fullWidth?: boolean;
    emptyMessage?: string;
}

export const MultipleSelect = <T, >(props: IMultipleSelect<T>) => {
    const map = new Map(props.options.map((option) => [props.getKey(option), option]));
    const keys = props.value.map((option) => props.getKey(option));

    return <Select value={keys} multiple displayEmpty fullWidth={props.fullWidth}
            onChange={(event) => props.onChange((event.target.value as string[]).map((value) => map.get(value)!))}
            renderValue={(selected) => (selected as string[]).length > 0 ? <React.Fragment>
                {(selected as string[]).map((value) =>
                    <Chip key={value} label={props.getLabel(map.get(value)!)} style={{marginRight: "1em"}} />)}
            </React.Fragment> : (props.emptyMessage || defaultEmptyMessage)}>
        {props.options.map((option) => (
            <MenuItem key={props.getKey(option)} value={props.getKey(option)}>
                <Checkbox checked={keys.indexOf(props.getKey(option)) >= 0} />
                <ListItemText primary={props.getLabel(option)} />
            </MenuItem>
        ))}
    </Select>;
};
