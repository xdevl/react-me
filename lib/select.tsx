/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import {StandardProps} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select, {SelectClassKey, SelectProps} from "@material-ui/core/Select";
import React, {useState} from "react";

const defaultEmptyMessage = "Select...";

type Options<T> = T[] | (() => Promise<T[]>);

const promisify = <T, >(options: Options<T>) => options instanceof Function ? options() : Promise.resolve(options);

interface ISelect<T, V> extends StandardProps<SelectProps, SelectClassKey, "value"|"onChange"|"onOpen"> {
    options: Options<T>;
    value?: V;
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    onChange: (item: V) => void;
    emptyMessage?: string;
}

export const SingleSelect = <T, >(properties: ISelect<T, T>) => {

    const {options, value, getKey, getLabel, onChange, emptyMessage, ...selectProps} = properties;
    const [optionValues, setOptionValues] = useState(options instanceof Array ? options : []);
    const loadOptionValues = () => {
        promisify(options).then((result) => setOptionValues(result));
    };

    const map = new Map(optionValues.concat(value ? [value] : [])
        .map((option) => [getKey(option), option]));

    return <Select {...selectProps} value={(value && getKey(value)) || ""}
            onOpen={loadOptionValues}
            onChange={(event) => onChange(map.get(event.target.value as string)!)}>
        <MenuItem value="" disabled>{emptyMessage || defaultEmptyMessage}</MenuItem>
        {Array.from(map.entries()).map(([key, option]) => (
            <MenuItem key={key} value={key}>{getLabel(option)}</MenuItem>
        ))}
    </Select>;
};

export const MultipleSelect = <T, >(properties: ISelect<T, T[]>) => {

    const {options, value, getKey, getLabel, onChange, emptyMessage, ...selectProps} = properties;
    const [optionValues, setOptionValues] = useState(options instanceof Array ? options : []);
    const loadOptions = () => {
        promisify(options).then((result) => setOptionValues(result));
    };

    const map = new Map(optionValues.concat(value || []).map((option) => [getKey(option), option]));
    const selection = (value || []).map((option) => getKey(option));

    return <Select {...selectProps} value={selection} multiple
            onChange={(event) => onChange((event.target.value as string[]).map((key) => map.get(key)!))}
            onOpen={loadOptions}
            renderValue={(selected) => (selected as string[]).length > 0 ? <React.Fragment>
                {(selected as string[]).map((key) =>
                    <Chip key={key} label={getLabel(map.get(key)!)} style={{marginRight: "1em"}} />)}
            </React.Fragment> : selectProps.displayEmpty && (emptyMessage || defaultEmptyMessage)}>
        <MenuItem value="" disabled>{emptyMessage || defaultEmptyMessage}</MenuItem>
        {Array.from(map.entries()).map(([key, option]) => (
            <MenuItem key={key} value={key}>
                <Checkbox checked={selection.indexOf(key) >= 0} />
                <ListItemText primary={getLabel(option)} />
            </MenuItem>
        ))}
    </Select>;
};
