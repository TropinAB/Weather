import * as geo from "./geoJS";
import { eventBus } from "./EventBus";

describe("Check geo module", () => {
  global.fetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
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

  const AllEvents = async (times = 3) => {
    for (let i = 1; i <= times; i++) {
      jest.runOnlyPendingTimers();
      await Promise.resolve(); // Для запуска fetch
    }
  };

  it("test Network error", async () => {
    fetch.mockRejectedValue(new Error(ERROR_MESSAGE));

    const processResults = jest.fn();

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.trigger(geo.eventNameCall);

    await AllEvents();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(
      expect.toMatchInlineSnapshot(`[Error: Network error]`),
    );
  });
  it("test Error response", async () => {
    fetch.mockResolvedValueOnce(errorResponse);

    const processResults = jest.fn();

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.trigger(geo.eventNameCall);

    await AllEvents();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(
      expect.toMatchInlineSnapshot(`[Error: Ошибка 404: Страница не найдена]`),
    );
  });
  it("test Success response", async () => {
    fetch.mockResolvedValueOnce(successResponse);

    const processResults = jest.fn();

    eventBus.on(geo.eventNameResult, processResults);
    eventBus.trigger(geo.eventNameCall);

    await AllEvents();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledTimes(1);
    expect(processResults).toHaveBeenCalledWith(successData);
  });
});
