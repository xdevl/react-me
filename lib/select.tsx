/*
 * Copyright (c) 2020 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import {StandardProps} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Select, {SelectClassKey, SelectProps} from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import {MeFlex} from "./layout";
import {meLoaderPromise} from "./utils";

const defaultLoadingLabel = "Loading...";
const defaultNoValueLabel = "Select...";
const defaultNoOptionLabel = "No options";

type Bool<T extends boolean = boolean> = T;

type Value<T, M extends Bool, O extends Bool> = M extends true ? T[] : (O extends true ? undefined|T : T);

type Options<T> = T[] | (() => Promise<T[]>);

const promisify = <T, >(options: Options<T>): Promise<T[]> => options instanceof Function ? options() : Promise.resolve(options);

interface MeSelectAdapter<T, M extends Bool> {
    valueArray: (value: Value<T, M, any>) => T[];
    map: <V, R>(value: Value<V, M, any>, func: (option: V) => R) => Value<R, M, any>;
    renderOption: (key: string, option: T, selected: boolean) => React.ReactNode;
    renderValue: (value: Value<T, M, false>) => React.ReactNode;
}

/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
const meSingleAdapter = <T, O extends Bool> (props: MeSelectProps<T, false, O>): MeSelectAdapter<T, false> => ({
    valueArray: (value) => props.optional && !value ? [] : [value as T],
    map: (value, func) => props.optional && !value ? undefined : func(value as any),
    renderOption: function(key, option, selected) {
        return <MenuItem key={key} value={key} selected={selected}>
                {props.getLabel(option) || props.noValueLabel || defaultNoValueLabel}
            </MenuItem>;
    },
    renderValue: (value) => props.getLabel(value) || props.noValueLabel || defaultNoValueLabel
});

const meMultipleAdapter = <T,> (props: MeSelectProps<T, true, true>): MeSelectAdapter<T, true> => ({
    valueArray: (value) => value,
    map: (value, func) => value.map(func),
    renderOption: (key, option, selected) =>  <MenuItem key={key} value={key}>
            <Checkbox checked={selected} />
            <ListItemText primary={props.getLabel(option)} />
        </MenuItem>,
    renderValue: (value) => value.length > 0 ? <MeFlex flexDirection="row" flexGap="0.5em" flexWrap="wrap">
            {value.map((item) =>
                <Chip key={props.getKey(item)} label={props.getLabel(item)} style={{marginRight: "1em"}} />)}
        </MeFlex> : (props.noValueLabel || defaultNoValueLabel)
});
/* eslint-disable react/display-name */
/* eslint-enable react/prop-types */

interface PopoverLoaderProps {
    open: boolean;
    anchorRef: React.RefObject<Element>;
    loadingLabel?: string;
}

const PopoverLoader = (props: PopoverLoaderProps): JSX.Element => {
    return <Popover open={props.open}
            anchorEl={props.anchorRef.current} anchorOrigin={{vertical: "top", horizontal: "center"}}
            transformOrigin={{vertical: "top", horizontal: "center"}}
            PaperProps={{style: {minWidth: props.anchorRef.current?.clientWidth}}}>
        <MeFlex flexDirection="row" flexGap="0.25em" style={{padding: "0.5em"}}>
            <div><CircularProgress size="1em" /></div>
            <Typography>{props.loadingLabel || defaultLoadingLabel}</Typography>
        </MeFlex>
    </Popover>;
};

interface MeSelectProps<T, M extends Bool, O extends Bool> extends StandardProps<SelectProps, SelectClassKey, "value"|"onChange"|"onOpen"|"renderValue"> {
    multiple?: M;
    optional?: O;
    options: Options<T>;
    value: Value<T, M, O>;
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    onChange: (item: Value<T, M, O>) => void;
    renderValue?: (value: Value<T, M, O>) => React.ReactNode;
    loadingLabel?: string;
    noValueLabel?: string;
    noOptionLabel?: string;
}

export const MeSelect = <T, M extends Bool = false, O extends Bool = false>(props: MeSelectProps<T, M, O>): JSX.Element => {
    const {optional, options, value, getKey, getLabel, onChange, loadingLabel,
        noValueLabel, noOptionLabel, renderValue, ...selectProps} = props;
    const [initialValue] = useState(value);
    const [optionValues, setOptionValues] = useState(options instanceof Array ? options : []);
    const [state, setState] = useState({open: false, loading: false});
    const ref = React.useRef<Element>(null);

    const loadOptionValues = (): Promise<void> => meLoaderPromise(promisify(options), 600,
            () => setState({open: false, loading: true}))
        .then((result) => setOptionValues(result))
        .finally(() => setState({open: true, loading: false}));

    const adapter = (props.multiple ? meMultipleAdapter(props as MeSelectProps<T, true, true>)
        : meSingleAdapter(props as MeSelectProps<T, false, O>)) as MeSelectAdapter<T, M>;
    const optionsMap = new Map(optionValues.concat(adapter.valueArray(initialValue)).map((option) => [getKey(option), option]));
    const selection = adapter.valueArray(value).map((option) => getKey(option));

    return <React.Fragment>
            <Select ref={ref} {...selectProps} value={adapter.map(value, getKey) || ""}
                onOpen={loadOptionValues} open={state.open}
                onClose={() => setState({open: false, loading: false})}
                onChange={(event) => onChange(adapter.map(event.target.value as Value<string, M, O>, (key) => optionsMap.get(key)!))}
                renderValue={(selected) => (renderValue || adapter.renderValue)(adapter.map(selected as Value<string, M, O>, (key) => optionsMap.get(key)!))}>
                    {optionsMap.size == 0 && <MenuItem key="" value="" disabled>{noOptionLabel || defaultNoOptionLabel}</MenuItem>}
                    {optionsMap.size > 0 && optional && <MenuItem key="" value="">{noValueLabel || defaultNoValueLabel}</MenuItem>}
                    {Array.from(optionsMap.entries())
                        .map(([key, option]) => adapter.renderOption(key, option, selection.includes(key)))}
            </Select>
            <PopoverLoader anchorRef={ref} open={state.loading} loadingLabel={loadingLabel} />
        </React.Fragment>;
}