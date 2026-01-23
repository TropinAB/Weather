export function Router() {
  const routes = [];
  let currentPath = location.pathname;
  let previousPath = null;

  const isMatch = (route, path) =>
    (route instanceof RegExp && route.test(path)) ||
    (typeof route === "function" && route(path)) ||
    (typeof route === "string" && route === path);

  const processRoute = (routeData) => {
    const args = { currentPath, previousPath, state: history.state };

    routeData.onEnter && isMatch(routeData.route) && routeData.onEnter(args);
  };

  const processAllRoutes = () => routes.forEach(processRoute);

  const on = (route, onEnter) => {
    const routeData = { route, onEnter };
    routes.push(routeData);
    processRoute(routeData);
  };

  const go = (url, state) => {
    previousPath = currentPath;
    history.pushState(state, url, url);
    currentPath = location.pathname;

    processAllRoutes();
  };

  window.addEventListener("popstate", processAllRoutes);

  return { on, go };
}
