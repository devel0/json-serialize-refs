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

console.log("selftest eq: " + String(obj2.selftest === obj2));
console.log("arrdata[0] eq: " + String(obj2.arrdata[0] === obj2));
console.log("selfarray eq: " + String(obj2.selfarray === obj2.arrdata));
console.log("arrdata2[0] eq: " + String(obj2.arrdata2[0] === obj2.arrdata));