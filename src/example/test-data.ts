import { PreserveType } from "../lib/stringify-refs";

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

export const test1_compare = (
    a: test1_type,
    b: test1_type,
    preserveMode: PreserveType) => {
    if (a.aobj!.strVal !== b.aobj!.strVal) return false;
    if (a.selftest! !== a || b.selftest! !== b) return false;
    if (a.value! !== b.value!) return false;

    const arrdataConsistency = (
        refobj1: test1_type,
        arr1: (test1_type | string)[],
        refobj2: test1_type,
        arr2: (test1_type | string)[]) => {
        if (arr1!.length !== arr2!.length) return false;
        for (let i = 0; i < arr1.length; ++i) {
            const x1 = arr1[i];
            const x2 = arr2[i];
            if (typeof x1 === "string") {
                if (x1 !== x2) return false;
            } else {
                if (x1 !== refobj1 || x2 !== refobj2) return false;
            }
        }
        return true;
    }
    if (!arrdataConsistency(a, a.arrdata!, b, b.arrdata!)) return false;

    if (preserveMode === PreserveType.All) {
        if (a.selfarray! !== a.arrdata!) return false;
        if (b.selfarray! !== b.arrdata!) return false;
    } else {
        if (!arrdataConsistency(a, a.selfarray!, b, b.selfarray!)) return false;
    }

    if (a.arrdata2!.length !== b.arrdata2!.length) return false;
    for (let i = 0; i < a.arrdata2!.length; ++i) {
        const ai = a.arrdata2![i];
        const bi = b.arrdata2![i];
        if (typeof ai === "string") {
            if (ai !== bi) return false;
        } else {
            if (preserveMode === PreserveType.All) {
                if (ai !== a.arrdata2[i]!) return false;
                if (bi !== b.arrdata2[i]!) return false;
            } else {
                const aai = a.arrdata2[i] as (string | test1_type)[];
                if (!arrdataConsistency(a, ai, a, aai)) return false;

                const bbi = b.arrdata2[i] as (string | test1_type)[];
                if (!arrdataConsistency(b, bi as (string | test1_type)[], b, bbi)) return false;
            }
        }
    }

    return true;
};

export const test1_make = () => {
    const obj: test1_type = {};
    obj.aobj = { strVal: "some" };
    obj.selftest = obj;
    obj.value = "sample string";
    obj.arrdata = [obj, "other"];
    obj.selfarray = obj.arrdata;
    obj.arrdata2 = [obj.arrdata, "another"];

    return obj;
};