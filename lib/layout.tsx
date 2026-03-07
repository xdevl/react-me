/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import Fade from "@mui/material/Fade";
import {Property} from "csstype";
import React, {PropsWithChildren, ReactNode, useState} from "react";

type DivProperties = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface MeFlexProps {
    alignContent?: Property.AlignContent;
    alignItems?: Property.AlignItems;
    flexDirection: Property.FlexDirection;
    justifyContent?: Property.JustifyContent;
    flexGap?: number|string;
    flexWrap?: Property.FlexWrap;
}

export const MeFlex = (properties: PropsWithChildren<MeFlexProps & DivProperties>): React.JSX.Element => {

    const {alignContent, alignItems, children, flexDirection, justifyContent,
        flexGap, flexWrap, ...wrapperProps} = properties;

    return <div {...wrapperProps} style={{...wrapperProps.style, flexWrap: "nowrap", display: "inline-flex", flexDirection}}>
        <div style={{
            alignContent: alignContent,
            alignItems: alignItems,
            display: "inline-flex",
            flexDirection: flexDirection,
            flexGrow: 1,
            justifyContent: justifyContent,
            flexWrap: flexWrap,
            gap: flexGap
        }}>{children}</div>
    </div>;
};

interface MeWrapperProps {
    wrap: (child: ReactNode) => ReactNode;
}

export const MeWrapper = (props: PropsWithChildren<MeWrapperProps>): React.JSX.Element =>
    <React.Fragment>{React.Children.map(props.children, (child) => props.wrap(child))}</React.Fragment>;

export const MeFader = (props: PropsWithChildren<DivProperties>): React.JSX.Element => {
    const [children, setChildren] = useState(props.children);
    return <Fade in={props.children === children} unmountOnExit
        appear={false} onExited={() => setChildren(props.children)}>
        <div {...props}>{children}</div>
    </Fade>;
};
