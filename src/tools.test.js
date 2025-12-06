import { sleep } from "./tools";

describe("Check sleep", () => {
  it("sleep is a function", () => expect(sleep).toBeInstanceOf(Function));
  it("sleep returns Promise", () => expect(sleep()).toBeInstanceOf(Promise));
});
