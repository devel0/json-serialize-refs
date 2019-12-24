import { helloWorld1, helloWorld2 } from "../lib/hello-world";

it("h1", () => {
    expect(helloWorld1()).toBe("hello");
});

it("h2", () => {
    expect(helloWorld2()).toBe("world");
});
