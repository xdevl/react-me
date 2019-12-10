/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import {makeStyles, Theme} from "@material-ui/core/styles";
import {AlignContentProperty, AlignItemsProperty, FlexDirectionProperty,
    FlexWrapProperty, JustifyContentProperty} from "csstype";
import React, {FunctionComponent, ReactNode} from "react";

type DivProperties = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface IFlex {
    alignContent?: AlignContentProperty;
    alignItems?: AlignItemsProperty;
    flexDirection: FlexDirectionProperty;
    justifyContent?: JustifyContentProperty;
    flexGap?: number|string;
    flexWrap?: FlexWrapProperty;
}

const useStyles = makeStyles<Theme, IFlex>({
    flex: (properties) => {
        const {flexGap, ...styles} = properties;
        return {
            display: "inline-flex",
            flexGrow: 1,
            margin: typeof flexGap === "number" ? flexGap * -1 : "-" + flexGap,
            ...styles,
            ...{"& > *": {margin: flexGap}},
        };
    },
});

export const Flex: FunctionComponent<IFlex & DivProperties> = (properties) => {
    const {alignContent, alignItems, children, flexDirection, justifyContent,
        flexGap, flexWrap, ...wrapperProps} = properties;
    const classes = useStyles({alignContent, alignItems, flexDirection, justifyContent, flexGap, flexWrap});
    return <div {...wrapperProps} style={{...wrapperProps.style, display: "inline-flex", flexDirection}}>
        <div className={classes.flex}>{children}</div>
    </div>;
};

export const Wrapper: FunctionComponent<{ wrap: (child: ReactNode) => ReactNode}> =
    (props) => <React.Fragment>{React.Children.map(props.children, (child) => props.wrap(child))}</React.Fragment>;
