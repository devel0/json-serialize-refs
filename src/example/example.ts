import { PreserveType, parseRefs, stringifyRefs } from "../index";
import { test1_make } from "./test-data";

// {
//     const obj = test1_make();

//     const json = stringifyRefs(obj, null, 1, PreserveType.Objects);

//     const obj2 = parseRefs(json);

//     console.log(json);
// }

interface test1_aobj_type {
    strVal: string;
}

interface test1_type {
    dt: Date;    
    boolTrue: boolean;
    boolFalse: boolean;
    nr: number;
    aobj: test1_aobj_type;
    selftest: test1_type;
    value: string;
    arrdata: (test1_type | string)[];
    selfarray: (test1_type | string)[];
    arrdata2: ((test1_type | string)[] | string)[];
}

const obj = {} as test1_type;
obj.dt = new Date("2019-12-31T23:59:59Z");
obj.boolTrue = true;
obj.boolFalse = false;
obj.nr = 3.14159;
obj.aobj = { strVal: "some" };
obj.selftest = obj;
obj.value = "sample string";
obj.arrdata = [obj, "other"];
obj.selfarray = obj.arrdata;
obj.arrdata2 = [obj.arrdata, "another"];

const json = stringifyRefs(obj, null, 1, PreserveType.All);

console.log("ORIG STRINGIFIED:");
console.log("-----------------------");
console.log(json);

const obj2 = parseRefs(json);
const json2 = stringifyRefs(obj2, null, 1, PreserveType.All);

console.log("OBJ2 STRINGIFIED:");
console.log("-----------------------");
console.log(json2);

console.log("VAL TEST RESULT:");
console.log("-----------------------");
console.log("dt eq: " + String(obj.dt.toString() === obj2.dt.toString()));
console.log("boolTrue eq: " + String(obj.boolTrue === obj2.boolTrue));
console.log("boolFalse eq: " + String(obj.boolFalse === obj2.boolFalse));
console.log("nr eq: " + String(obj.nr === obj2.nr));

console.log("SELF TEST RESULT:");
console.log("selftest eq: " + String(obj2.selftest === obj2));
console.log("arrdata[0] eq: " + String(obj2.arrdata[0] === obj2));
console.log("selfarray eq: " + String(obj2.selfarray === obj2.arrdata));
console.log("arrdata2[0] eq: " + String(obj2.arrdata2[0] === obj2.arrdata));