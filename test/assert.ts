import React from "react";
import renderer from "react-test-renderer";

export function dumpRendering(value: renderer.ReactTestRendererNode, depth = 0): string {
  const indent = " ".repeat(depth);
  if (typeof value === "string") {
    return `${indent}${value}\n`;
  } else {
    const children = (value.children || []).map((child) => dumpRendering(child, depth + 1));
    return `${indent}<${value.type}>\n${children.join("")}${indent}</${value.type}>\n`;
  }
}

export default function assertRendering(current: renderer.ReactTestRendererNode, expected: React.ReactNode) {
  if (typeof current === "string") {
    expect(current).toEqual(expected);
  } else if (React.isValidElement<{ children?: React.ReactNode }>(expected)) {
    expect(expected.type).toEqual(current.type);
    React.Children.forEach(expected.props.children, (child, index) => {
      assertRendering(current.children![index], child);
    });
  } else {
    fail(`${current} should be a string`);
  }
}
