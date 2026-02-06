import { Router } from "./Router";

describe("Check Router module", () => {
  const testData = { data: 123 };

  // Мокаем браузерные API перед всеми тестами - не работают в таком виде :(
  beforeEach(() => {
    // Мокаем window.location
    // delete global.window.location;
    // global.window = Object.create(window);
    // global.window.location = {
    //   pathname: '/'
    // };
    // window.location.href = 'http://localhost/';
    // window.location.pathname = '/';

    // Мокаем window.history
    // window.history = {
    //   pushState: jest.fn(),
    //   replaceState: jest.fn(),
    //   state: null,
    //   back: jest.fn(),
    //   forward: jest.fn(),
    //   go: jest.fn(),
    // };

    // Мокаем addEventListener
    window.addEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Router is function", () => {
    expect(Router).toBeInstanceOf(Function);
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
    const router = Router();

    router.on("/", mockOnEnter);

    expect(mockOnEnter).toHaveBeenCalledWith({
      currentPath: "/",
      previousPath: null,
      state: null,
    });
  });

  test("on() should not call onEnter for non-matching path", () => {
    const mockOnEnter = jest.fn();
    const router = Router();

    router.on("/home", mockOnEnter);

    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  test("go() should update history and call registered handlers", () => {
    const mockOnEnter1 = jest.fn();
    const mockOnEnter2 = jest.fn();
    const router = Router();

    // Регистрируем обработчики
    router.on("/", mockOnEnter1);
    router.on("/about", mockOnEnter2);

    // Переходим на новую страницу
    router.go("/about", testData);

    // Проверяем вызов history.pushState
    // expect(window.history.pushState).toHaveBeenCalledWith(
    //   testData,
    //   '/about',
    //   '/about'
    // );

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
    const router = Router();

    router.on(/^\/users\/\d+$/, mockOnEnter);

    router.go("/users/123");

    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should handle function routes", () => {
    const mockOnEnter = jest.fn();
    const router = Router();
    const routeMatcher = (path) => path.startsWith("/api/");

    router.on(routeMatcher, mockOnEnter);

    router.go("/api/users");

    expect(mockOnEnter).toHaveBeenCalled();
  });
});
