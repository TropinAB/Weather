import { runApp } from "./runApp";

global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve({}),
  });
});

describe("Check runApp", () => {
  it("runApp is a function", () => expect(runApp).toBeInstanceOf(Function));
  it("some test 2", () => {
    const el = document.createElement("div");
    runApp(el);
    expect(el.children).toHaveLength(3);
  });
});
