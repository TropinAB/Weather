import { runApp } from "./runApp";

describe("Check runApp", () => {
  it("runApp is a function", () => expect(runApp).toBeInstanceOf(Function));
  it("some test 2", () => {
    const el = document.createElement("div");
    runApp(el);
    expect(el.children).toHaveLength(3);
  });
});
