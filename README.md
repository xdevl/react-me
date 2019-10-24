# React Made Easy
A library of common react components to boost productivity.

## Installation
This library can simply be installed using npm:
```shell
npm install react-me
```
## Routing
In order to use the routing components you will need to wrap your top level component with the `withMeRouter` directive as shown below:
```javascript
ReactDOM.render(withMeRouter(<App />), document.querySelector("#root"));
```

Then, simple routing can easily be achieved as shown in the code snippet below

```html
<MeRouter>
  <MeRoute path={new MePath("login")} render={() =>
    <h1>Login</h1>
  }/>
  <MeRoute path={new MePath("public").then("home")} render={() =>
    <h1>Home</h1>
  }/>
  <MeRoute path={new MePath().thenSubPath("subPath")} render={() =>
    <h1>Not found</h1>
  }/>
</MeRouter>
```

The routing classes support the capture of parameters and leverage the full power of typescript to enforce strict naming and typing checks:
```html
<MeRouter>
  <MeRoute path={new MePath("user").thenNum("id").thenStr("view")} render={(params) => 
    <div>{params.id} / {params.view}</div>
  }/>
</MeRouter>

```

Nested routing can also be achieved using the subPath parameter capture:
```html
<MeRouter>
  <MeRoute path={new MePath("admin").thenSubPath("subPath")} render={(params) =>
    <!-- Nested admin routing -->
    <MeRouter subPath={params.subPath}>
      <MeRoute path={new MePath("list").then("all")} render={(params) =>
        <!-- User list here... -->
      }/>
      <MeRoute path={new MePath("edit").thenNum("userID")} render={(params) =>
        <!-- User form here... -->
      }/>
    </MeRouter>
  }/>
  <MeRoute path={new MePath().thenSubPath("subPath")} render={() =>
    <h1>Not found</h1>
  }/>
</MeRouter>

```


## Table
This component simplifies the creation of tables which is usually quite verbose. From the following given data set for example:
```javascript
const people = [
    { name: "Nannie", surname: "Reid", age: 23 },
    { name: "Ernest", surname: "Avila", age: 64 },
    { name: "Elwood", surname: "Harding", age: 32 },
  ];
```
One can create a table as simply as:
```javascript
<MeTable values={people} columns={columnsFrom("name", "surname", "age")} />

```

### Columns customisation
It is possible to customise column's headers and how cells are being rendered by defining each column indvidually as shown below:
```javascript
<MeTable values={people} columns={[
  {label: "Full Name", render: (person) => <span>{person.name} {person.surname}</span>},
  {label: "Age", render: renderField("age")},
]} />
```

## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
