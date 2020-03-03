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
```javascript
const Routes = (({none, path}) => {
  login: new MeRoute(MePath.then("login")),
  home: new MeRoute(MePath.then("public").then("home")),
  notFound: new MeRoute(none, path("path")),
})(MePath);

<MeRouter routes = {[
  Routes.login.callback(() => <h1>Login</h1>),
  Routes.home.callback(() => <h1>Home</h1>),
  Routes.notFound.callback(() => <h1>Not Found</h1>),
]} />
```

The routing classes support the capture of parameters and leverage the full power of typescript to enforce strict naming and type checks:
```javascript
const Routes = (({num, str}) => {
  userView: new MeRoute(MePath.then("user").then(num("id")).then(str("view")))
})(MePath);

<MeRouter routes = {[
  Routes.userView.callback((params) => <div>{params.id} / {params.view}</div>),
]} />

```

Nested routing can also be achieved as shown below:
```javascript
const Routes = (({num, path}) => {
  admin: new MeRoute(MePath.then("admin"), path("path")),
  list: new MeRoute(MePath.then("list").then("all")),
  edit: new MeRoute(MePath.then("edit").then(num("userID"))),
})(MePath);

<MeRouter routes = {[
  Routes.admin.callback((params) => 
    // Nested admin routing 
    <MeRouter path={`/${params.path || ""}`} routes = {[
      Routes.list.callback(() =>
        // User list here...
      ),
      Routes.edit.callback((params) =>
        // User form here...
      ),
    ]} />
  ),
]} />
```

Once application routes have been defined, routing to one of them can be easily achieved using the application routing context:

```javascript
const Routes = (({num}) => ({
    userDetails: new MeRoute(MePath.then("user").then(num("id")))
}))(MePath);

const router = useContext(MeRouterContext);
<button onClick={() =>
    router.route(Routes.userDetails.format({id: 123456}))}>
  Click me!
</button>

```

## Flow
This component let's you chain multiple components all together to easily pass data from one to another
```javascript
const MyForm = new MeFlow<number>()
        .then<number>((value, next) => <div onClick={() => next(String(value * 2))}>I am {value}, click to double me</div>)
        .then<string>((value, next, previous) => <div onClick={() => previous(Number(value) / 2)}>I am {value}, click to half me</div>)
        .render(8);

<MyForm />

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

## Select

The select components define a concise interface in order to easily pick one or multiple entries from a pre-defined list of objects. Given the following list of products for example:

```javascript
const products = [
    { name: "Apple", id: 345768 },
    { name: "Orange", id: 287456 },
    { name: "Pear", id: 124632 },
  ];
```

### Single

```javascript
<MeSingleSelect options={products} value={products[0]}
  getKey={(product) => String(product.id)}
  getLabel={(product) => product.name}
  onChange={(product) => alert("You've selected: " + product.name)} />
```

### Multiple
```javascript
<MeMultipleSelect options={products} value={[products[0], products[1]]}
  getKey={(product) => String(product.id)}
  getLabel={(product) => product.name}
  onChange={(products) => alert("You've selected: " + products.map((product) => product.name).join(","))} />
```

## Fader
This component will automatically run a fade in and out animation whenever one of its direct children changes:
```javascript
const [flag, setFlag] = React.useState(true);
<MeFader>
  {flag ? <h1>A view</h1> : <h1> Another view</h1>}
  <button onClick={() => setFlag((old) => !old)}>Click me!</button>
</MeFader>
```

## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
