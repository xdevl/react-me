import React from "react";

export function dumpRendering(value: Element, depth = 0): string {
  const indent = " ".repeat(depth);
  if (value.childElementCount > 0) {
      const children = (asList(value.children) || []).map((child) => dumpRendering(child, depth + 1));
      return `${indent}<${value.tagName}>\n${children.join("")}${indent}</${value.tagName}>\n`
  } else {
    return `${indent}<${value.tagName}>${value.textContent}</${value.tagName}>\n`
  }
}

function asList(children: HTMLCollection): Element[] {
  const list: Element[] = []
  for (let i = 0; i < children.length; i++) {
    if (children[i] != null) {
      list.push(children[i])
    }
  }
  return list
}

export function assertRendering(value: Element | String, expected: React.ReactNode) {
  if (typeof value == "string") {
    expect(expected).toEqual(value)
  } else if (value instanceof Element && React.isValidElement<{ children?: React.ReactNode }>(expected)) {
    expect(value.tagName.toLowerCase()).toEqual(expected.type.toString().toLowerCase());
    if (value.childElementCount > 0) {
      expect(React.Children.count(expected.props.children)).toEqual(value.childElementCount);
    } 
    React.Children.forEach(expected.props.children, (child, index) => {
      if (value.childElementCount > 0) {
        assertRendering(value.children[index], child);
      } else {
        assertRendering(value.textContent, child);
      }
    });
  } else {
    throw new Error(`${value} should be a string`);
  }
}
