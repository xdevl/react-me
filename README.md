# React Made Easy
A library of common react components to boost productivity.

## Installation
This library can simply be installed using npm:
```shell
npm install react-me
```
## Table
This component simplifies the creation of tables which is usually quite verbose. From the following given data set for example:
```javascript
const data = [
    { name: "Nannie", surname: "Reid", age: 23 },
    { name: "Ernest", surname: "Avila", age: 64 },
    { name: "Elwood", surname: "Harding", age: 32 },
  ];
```
One can create a table as simply as:
```html
<MeTable values={data}>
  <MeColumn label="Name" field="name" />
  <MeColumn label="Surname" field="surname" />
  <MeColumn label="Age" field="age" />
</MeTable>
```
### Automatic column generation
`MeAutoTable` is a component that uses a regular `MeTable` under the hood but automatically finds out its columns based on the input set. This component can be really handy for quick prototyping and during early development phases when your data structure is not fully defined yet and is prone to change.
```html
<MeAutoTable values={data} />
```
### Custom cell rendering
It is possible to customise how cells are being rendered for a given column by using the `render` attribute as shown below:
```html
<MeColumn label="Name" field="name" render={(value) =>
    <span>My name is {value}</span>
}>
```
Custom cell rendering can also be achieved with `MeAutoTable` in order to change both the resulting cell and the column label, just manually define the column you want to change:
```html
<MeAutoTable values={data}>
    <MeColumn label="How old is he?" field="age" render={(value) =>
        <span>{age} years old</span>
    }>
</MeAutoTable>
```

## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
