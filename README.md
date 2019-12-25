# json-serialize-refs

[![NPM](https://img.shields.io/npm/v/json-serialize-refs.svg)](https://www.npmjs.com/package/json-serialize-refs) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

serialize and deserialize preserving refs ( resolving circular references automatically ) compatible with [Newtonsoft.Json for NET](https://www.newtonsoft.com/json/help/html/PreserveObjectReferences.htm)

## install

```sh
yarn add json-serialize-refs
```

## usage

prototypes:

```ts
/** convert given obj to json resolving references as specified by preserveType ( NewtonJson NET compatible ) */
function stringifyRefs(obj: any, replacer: any = null, space: any = null, preserveType: PreserveType = PreserveType.All);

/** convert back from json to object reconnecting references if any ( Newtonsoft JSON compatible ) */
function parseRefs(text: string, reviver?: (this: any, key: string, value: any) => any);

/** helper for fetch json text and parse */
function parseRefsResponse<T = any>(jsonPromise: Promise<string>): Promise<T>;
```

serialize/deserialize example:

```ts
import { stringifyRefs, parseRefs, PreserveType } from "json-serialize-refs";

interface test1_aobj_type {
    strVal: string;
}

interface test1_type {
    aobj?: test1_aobj_type;
    selftest?: test1_type;
    value?: string;
    arrdata?: (test1_type | string)[];
    selfarray?: (test1_type | string)[];
    arrdata2?: ((test1_type | string)[] | string)[];
}

const obj: test1_type = {};
obj.aobj = { strVal: "some" };
obj.selftest = obj;
obj.value = "sample string";
obj.arrdata = [obj, "other"];
obj.selfarray = obj.arrdata;
obj.arrdata2 = [obj.arrdata, "another"];

const json = stringifyRefs(obj, null, 1, PreserveType.All);
const obj2 = parseRefs(json);

console.log(json);

console.log("selftest eq: " + String(obj2.selftest === obj2));
console.log("arrdata[0] eq: " + String(obj2.arrdata[0] === obj2));
console.log("selfarray eq: " + String(obj2.selfarray === obj2.arrdata));
console.log("arrdata2[0] eq: " + String(obj2.arrdata2[0] === obj2.arrdata));
```

output:

```
{
 "$id": "1",
 "aobj": {
  "$id": "2",
  "strVal": "some"
 },
 "selftest": {
  "$ref": "1"
 },
 "value": "sample string",
 "arrdata": {
  "$id": "3",
  "$values": [
   {
    "$ref": "1"
   },
   "other"
  ]
 },
 "selfarray": {
  "$ref": "3"
 },
 "arrdata2": {
  "$id": "4",
  "$values": [
   {
    "$ref": "3"
   },
   "another"
  ]
 }
}
selftest eq: true
arrdata[0] eq: true
selfarray eq: true
arrdata2[0] eq: true
```

parse webapi data:

```ts
fetch('sys/doSomething',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: stringifyRefs({ token, nfos })
    })
    .then(response => parseRefsResponse<IData>(response.text()))
    .then(someData => {
```

with c# net core webapi service configured this way:

```cs
public void ConfigureServices(IServiceCollection services)
{
    //...

    services.AddMvc().AddNewtonsoftJson((o) =>
    {
        o.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.All;
    });

    //...
}
```

tip: use [Reinforced.Typings](https://github.com/reinforced/Reinforced.Typings) tool to convert NET types to Typescript ( [example](https://github.com/devel0/example-netcore-to-typescript) )

## how to contribute ( quickstart )

```sh
git clone https://github.com/devel0/json-serialize-refs.git
cd json-serialize-refs
yarn install
code .
```

- hit F5 to start example

## unit tests

- run unit tests with `yarn test`
- [tests](src/test/stringify-refs.test.ts) verifies stringify and parse so that [test-data](src/example/test-data.ts) object:
    - stringified accomplish to newtonsoft json preserve reference format outputs for [Preserve All](src/test/test1-preserve-all.json) and [Preserve Objects](src/test/test1-preserve-objs.json)
    - then parsed back satisfy [object comparision](https://github.com/devel0/json-serialize-refs/blob/4201580290eff5f1b66167d1cb3f4dc494282385/src/example/test-data.ts#L16-L71)

## launchers

from vscode CTRL+SHIFT+D follows launchers available

- "Launch Program" : start example program
- "Debug Jest Tests" : run unit test with ability to breakpoint on them
- "netcore ( preserve object )" and "netcore ( preserve all )" generate newtonsoft json format into netcore folder

## troubleshoots

from deserialization of All preserve type Newtonsoft generate follow error "Cannot preserve reference to array or readonly list, or list created from a non-default constructor: System.Int32[]" ( see [answer](https://stackoverflow.com/a/41307438/5521766) ) ; a workaround is to use `Objects` (already the default) preserve mode.
