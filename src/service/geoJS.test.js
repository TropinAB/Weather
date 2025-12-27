import { getCurrentLocationData } from "./geoJS";

describe("Check getCurrentLocationData function", () => {
  global.fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ERROR_MESSAGE = "Network error";
  const errorResponse = {
    ok: false,
    status: 404,
    statusText: "Страница не найдена",
  };
  const successData = { country: "РФ", city: "Санкт-Петербург" };
  const successResponse = {
    ok: true,
    json: () => Promise.resolve(successData),
  };

  it("getCurrentLocationData is a function", () =>
    expect(getCurrentLocationData).toBeInstanceOf(Function));
  it("test Network error", async () => {
    fetch.mockRejectedValue(new Error(ERROR_MESSAGE));

    await expect(getCurrentLocationData()).resolves.toThrow(ERROR_MESSAGE);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("test Error response", async () => {
    fetch.mockResolvedValueOnce(errorResponse);

    await expect(getCurrentLocationData()).resolves.toThrow(
      `Ошибка 404: Страница не найдена`,
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("test Success response", async () => {
    fetch.mockResolvedValueOnce(successResponse);

    await expect(getCurrentLocationData()).resolves.toBe(successData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
