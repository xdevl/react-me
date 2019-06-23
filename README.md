# React Made Easy
A library of common react components to boost productivity.

## Installation
This library can simply be installed using npm:
```shell
npm install react-me
```
## Usage
### Dao Table
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
<DaoTable values={data}>
  <DaoColumn label="Name" field="name" />
  <DaoColumn label="Surname" field="surname" />
  <DaoColumn label="Age" field="age" />
</DaoTable>
```
### Reflective Dao Table
This component uses a Dao Table under the hood but automatically finds out its columns based on the input set. This component can be really handy for quick prototyping and during early development phases when your data structure is not fully defined yet and is prone to change.
```html
<ReflectiveDaoTable values={data} />
```

## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
