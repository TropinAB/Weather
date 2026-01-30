import { Router } from "./Router";

describe("Check Router module", () => {
  const testData = { data: 123 };

  beforeEach(() => {
    window.addEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Router has methods", () => {
    const router = new Router();
    expect(router).toHaveProperty("on");
    expect(router).toHaveProperty("go");
    expect(window.addEventListener).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function),
    );
  });
  test("on() should register route and call onEnter for matching path", () => {
    const mockOnEnter = jest.fn();
    const router = new Router();

    router.on("/", mockOnEnter);

    expect(mockOnEnter).toHaveBeenCalledWith({
      currentPath: "/",
      previousPath: null,
      state: null,
    });
  });

  test("on() should not call onEnter for non-matching path", () => {
    const mockOnEnter = jest.fn();
    const router = new Router();

    router.on("/home", mockOnEnter);

    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  test("go() should update history and call registered handlers", () => {
    const mockOnEnter1 = jest.fn();
    const mockOnEnter2 = jest.fn();
    const router = new Router();

    // Регистрируем обработчики
    router.on("/", mockOnEnter1);
    router.on("/about", mockOnEnter2);

    expect(window.location.pathname).toBe("/");

    // Переходим на новую страницу
    router.go("/about", testData);

    // Проверяем обновление пути
    expect(window.location.pathname).toBe("/about");

    // Проверяем вызовы обработчиков
    expect(mockOnEnter1).toHaveBeenCalledTimes(1);
    expect(mockOnEnter2).toHaveBeenCalledTimes(1);

    // Последний вызов mockOnEnter2 должен быть с правильными аргументами
    expect(mockOnEnter2).toHaveBeenCalledWith({
      currentPath: "/about",
      previousPath: "/",
      state: testData,
    });
  });

  test("should handle regex routes", () => {
    const mockOnEnter = jest.fn();
    const router = new Router();

    router.on(/^\/users\/\d+$/, mockOnEnter);

    router.go("/users/123", {});

    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should handle function routes", () => {
    const mockOnEnter = jest.fn();
    const router = new Router();
    const routeMatcher = (path: string) => path.startsWith("/api/");

    router.on(routeMatcher, mockOnEnter);

    router.go("/api/users", {});

    expect(mockOnEnter).toHaveBeenCalled();
  });
});
