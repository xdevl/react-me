/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import Fade from "@material-ui/core/Fade";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {AlignContentProperty, AlignItemsProperty, FlexDirectionProperty,
    FlexWrapProperty, JustifyContentProperty} from "csstype";
import React, {FunctionComponent, ReactNode, useState} from "react";

type DivProperties = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface IMeFlex {
    alignContent?: AlignContentProperty;
    alignItems?: AlignItemsProperty;
    flexDirection: FlexDirectionProperty;
    justifyContent?: JustifyContentProperty;
    flexGap?: number|string;
    flexWrap?: FlexWrapProperty;
}

const useStyles = makeStyles<Theme, IMeFlex>({
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

export const MeFlex: FunctionComponent<IMeFlex & DivProperties> = (properties) => {
    const {alignContent, alignItems, children, flexDirection, justifyContent,
        flexGap, flexWrap, ...wrapperProps} = properties;
    const classes = useStyles({alignContent, alignItems, flexDirection, justifyContent, flexGap, flexWrap});
    return <div {...wrapperProps} style={{...wrapperProps.style, display: "inline-flex", flexDirection}}>
        <div className={classes.flex}>{children}</div>
    </div>;
};

export const MeWrapper: FunctionComponent<{ wrap: (child: ReactNode) => ReactNode}> =
    (props) => <React.Fragment>{React.Children.map(props.children, (child) => props.wrap(child))}</React.Fragment>;

export const MeFader: FunctionComponent<DivProperties> = (props) => {
    const [children, setChildren] = useState(props.children);
    return <Fade in={props.children === children} unmountOnExit
        appear={false} onExited={() => setChildren(props.children)}>
        <div {...props}>{children}</div>
    </Fade>;
};
