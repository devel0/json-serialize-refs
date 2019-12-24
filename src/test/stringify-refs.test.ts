import { createRefs, stringifyRefs, PreserveType, parseRefs } from "../lib/stringify-refs";
import { test1_make, test1_compare } from "../example/test-data";
import * as fs from 'fs';

describe("test1", () => {
    const obj = test1_make();

    {
        it("testing a circular ref obj", () => {
            try {
                const q = JSON.stringify(obj);
            } catch (e) {
                expect(e.message).toContain("circular");
            }
        });
    }    

    {
        const expectedAll = fs.readFileSync("src/test/test1-preserve-all.json").toString();
        const resultingAll = stringifyRefs(obj, null, 1, PreserveType.All);

        // fs.writeFileSync("src/test/test1-preserve-all.json.ok", resultingAll);

        it("preserve all", () => expect(expectedAll).toEqual(resultingAll));

        const obj2 = parseRefs(resultingAll);

        const areEqualsContent = test1_compare(obj, obj2, PreserveType.All);
        it("preserve all eq content", () => expect(areEqualsContent).toBeTruthy());

        const obj2serialized = stringifyRefs(obj2, null, 1, PreserveType.All);

        it("preserve all 2", () => expect(expectedAll).toEqual(obj2serialized));

    }

    {
        const expectedObjs = fs.readFileSync("src/test/test1-preserve-objs.json").toString();
        const resultingObjs = stringifyRefs(obj, null, 1, PreserveType.Objects);

        // fs.writeFileSync("src/test/test1-preserve-objs.json.ok", resultingObjs);

        it("preserve objs", () => expect(expectedObjs).toEqual(resultingObjs));

        const obj2 = parseRefs(resultingObjs);

        const areEqualsContent = test1_compare(obj, obj2, PreserveType.Objects);
        it("preserve obj eq content", () => expect(areEqualsContent).toBeTruthy());

        const obj2serialized = stringifyRefs(obj2, null, 1, PreserveType.Objects);

        it("preserve objs 2", () => expect(expectedObjs).toEqual(obj2serialized));
    }
   
});
